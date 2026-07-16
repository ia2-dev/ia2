const NS = {
  schema: "https://schema.org/",
  current: "https://current.example/vocab/",
  mail: "https://current.example/mail/",
  xsd: "http://www.w3.org/2001/XMLSchema#",
};

const issues = [
  { id: 142, title: "Add keyboard navigation to command menu", status: "In progress", assignee: "Maya Chen", kind: "Accessibility" },
  { id: 141, title: "Clarify empty state for new workspaces", status: "Todo", assignee: "Jon Bell", kind: "Product" },
  { id: 139, title: "Document RDF Navigator refresh behavior", status: "Todo", assignee: "Maya Chen", kind: "Documentation" },
  { id: 136, title: "Align compact table spacing across views", status: "Done", assignee: "Ari Soto", kind: "Design system" },
];

const messages = [
  { id: 31, from: "Jon Bell", to: "Maya Chen", subject: "Keyboard review notes", body: "I finished the keyboard pass. The command menu works well now. I left two notes on focus return and the empty search state.\n\nCould you take a look before Thursday?", time: "10:42", read: false, starred: true, archived: false, sent: false },
  { id: 30, from: "Ari Soto", to: "Maya Chen", subject: "New density tokens", body: "The compact spacing tokens are ready. They preserve the current rhythm while making the issue table easier to scan on smaller screens.", time: "Yesterday", read: false, starred: false, archived: false, sent: false },
  { id: 29, from: "RDF Working Group", to: "Maya Chen", subject: "Core 0.1 editor draft", body: "The latest editor draft is available for review. The examples now cover live DOM changes and source navigation.", time: "Mon", read: true, starred: false, archived: false, sent: false },
];

let issueSequence = 143;
let mailSequence = 32;
let activeIssueFilter = "All";
let activeFolder = "inbox";
let openMessageId = null;
let toastTimer;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const issueList = $("#issue-list");
const mailList = $("#mail-list");

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function slugStatus(status) {
  return status.toLowerCase().replaceAll(" ", "-");
}

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function issueKey(id) {
  return `issue-${id}`;
}

function mailSubject(id) {
  return `${NS.mail}${id}`;
}

function semanticAttrs(subject, predicate) {
  return `rdf-subject="${subject}" rdf-predicate="${predicate}"`;
}

function semanticKeyAttrs(key, predicate) {
  return `rdf-subject-key="${key}" rdf-predicate="${predicate}"`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function renderIssues() {
  const query = $("#issue-search").value.trim().toLowerCase();
  const visible = issues.filter((issue) => (activeIssueFilter === "All" || issue.status === activeIssueFilter) && `${issue.title} ${issue.assignee} ${issue.kind} ${issue.id}`.toLowerCase().includes(query));

  issueList.innerHTML = visible.map((issue) => {
    const key = issueKey(issue.id);
    return `<article class="issue-row" role="row" data-issue-id="${issue.id}" rdf-subject="" rdf-predicate="${NS.current}hasIssue" rdf-object-key="${key}">
      <div class="issue-summary" role="cell">
        <span class="issue-title" ${semanticKeyAttrs(key, `${NS.schema}name`)}>${escapeHtml(issue.title)}</span>
        <span class="issue-meta"><span class="issue-id" ${semanticKeyAttrs(key, `${NS.schema}identifier`)}>CUR-${issue.id}</span><span class="issue-kind" ${semanticKeyAttrs(key, `${NS.schema}keywords`)}>${escapeHtml(issue.kind)}</span></span>
      </div>
      <data class="status-carrier" role="cell" value="${escapeHtml(issue.status)}" ${semanticKeyAttrs(key, `${NS.current}issueStatus`)}><select class="status-select" data-state="${slugStatus(issue.status)}" aria-label="Status for ${escapeHtml(issue.title)}">
        ${["Todo", "In progress", "Done"].map((status) => `<option${status === issue.status ? " selected" : ""}>${status}</option>`).join("")}
      </select></data>
      <span class="assignee" role="cell"><span class="assignee-avatar" aria-hidden="true">${initials(issue.assignee)}</span><span ${semanticKeyAttrs(key, `${NS.schema}assignee`)}>${escapeHtml(issue.assignee)}</span></span>
      <div class="row-actions" role="cell"><button class="row-action edit" type="button" data-action="edit" aria-label="Edit ${escapeHtml(issue.title)}" title="Edit">✎</button><button class="row-action delete" type="button" data-action="delete" aria-label="Delete ${escapeHtml(issue.title)}" title="Delete">×</button></div>
    </article>`;
  }).join("");

  $("#issue-empty").hidden = visible.length > 0;
  $(".issue-table").hidden = visible.length === 0;
  updateCounts();
}

function updateCounts() {
  const issueCounts = Object.fromEntries(["Todo", "In progress", "Done"].map((status) => [status, issues.filter((issue) => issue.status === status).length]));
  $("#issue-nav-count").textContent = issues.length;
  $("#all-count").textContent = issues.length;
  $("#todo-count").textContent = issueCounts.Todo;
  $("#progress-count").textContent = issueCounts["In progress"];
  $("#done-count").textContent = issueCounts.Done;
  $("#mail-nav-count").textContent = messages.filter((message) => !message.read && !message.archived && !message.sent).length;
  $("#unread-count").textContent = messages.filter((message) => !message.read && !message.archived && !message.sent).length;
  $("#starred-count").textContent = messages.filter((message) => message.starred && !message.archived).length;
  $("#archive-count").textContent = messages.filter((message) => message.archived).length;
  $("#sent-count").textContent = messages.filter((message) => message.sent).length;
}

function openIssueForm() {
  const form = $("#issue-form");
  form.hidden = false;
  $("[name=title]", form).focus();
}

function closeIssueForm() {
  const form = $("#issue-form");
  form.hidden = true;
  form.reset();
  $("[name=assignee]", form).value = "Maya Chen";
}

function beginIssueEdit(row, issue) {
  if ($(".edit-panel", row)) return;
  const panel = document.createElement("form");
  panel.className = "edit-panel";
  panel.setAttribute("aria-label", `Edit ${issue.title}`);
  panel.innerHTML = `<label class="sr-only" for="edit-title-${issue.id}">Title</label><input id="edit-title-${issue.id}" name="title" value="${escapeHtml(issue.title)}" required maxlength="90"><label class="sr-only" for="edit-assignee-${issue.id}">Assignee</label><input id="edit-assignee-${issue.id}" name="assignee" value="${escapeHtml(issue.assignee)}" required maxlength="40"><button class="primary-button" type="submit">Save</button>`;
  row.append(panel);
  $("input", panel).focus();
  panel.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(panel);
    issue.title = String(data.get("title")).trim();
    issue.assignee = String(data.get("assignee")).trim();
    renderIssues();
    showToast(`CUR-${issue.id} updated. RDF refreshed.`);
  });
}

function messageVisible(message) {
  if (activeFolder === "inbox") return !message.archived && !message.sent;
  if (activeFolder === "starred") return message.starred && !message.archived;
  if (activeFolder === "archive") return message.archived;
  return message.sent;
}

function renderMail() {
  const query = $("#mail-search").value.trim().toLowerCase();
  const visible = messages.filter((message) => messageVisible(message) && `${message.from} ${message.to} ${message.subject} ${message.body}`.toLowerCase().includes(query));
  const listMessages = openMessageId === null ? visible : visible.filter((message) => message.id !== openMessageId);
  mailList.innerHTML = listMessages.map((message) => {
    const subject = mailSubject(message.id);
    const sender = message.sent ? `To: ${message.to}` : message.from;
    return `<article class="mail-row${message.read ? "" : " is-unread"}" data-mail-id="${message.id}">
      <data class="mail-action-carrier" value="${message.starred}" rdf-datatype="${NS.xsd}boolean" ${semanticAttrs(subject, `${NS.current}isStarred`)}><button class="star-button${message.starred ? " is-starred" : ""}" type="button" data-action="star" aria-label="${message.starred ? "Unstar" : "Star"} ${escapeHtml(message.subject)}" aria-pressed="${message.starred}" title="${message.starred ? "Unstar" : "Star"}">${message.starred ? "★" : "☆"}</button></data>
      <span class="mail-from" data-action="open" tabindex="0" role="button" ${semanticAttrs(subject, message.sent ? `${NS.schema}recipient` : `${NS.schema}sender`)}>${escapeHtml(sender)}</span>
      <span class="mail-preview" data-action="open" tabindex="0" role="button"><span class="mail-subject" ${semanticAttrs(subject, `${NS.schema}headline`)}>${escapeHtml(message.subject)}</span><span class="mail-snippet" ${semanticAttrs(subject, `${NS.schema}description`)}>${escapeHtml(message.body.replace(/\s+/g, " "))}</span></span>
      <data class="mail-state" value="${message.read}" rdf-datatype="${NS.xsd}boolean" ${semanticAttrs(subject, `${NS.current}isRead`)}>${message.read ? "Read" : "Unread"}</data>
      <span class="mail-time" ${semanticAttrs(subject, `${NS.schema}dateReceived`)}>${escapeHtml(message.time)}</span>
      <data class="mail-action-carrier" value="${message.archived ? "Archive" : "Inbox"}" ${semanticAttrs(subject, `${NS.current}mailbox`)}><button class="archive-button" type="button" data-action="archive" aria-label="${message.archived ? "Move to inbox" : "Archive"} ${escapeHtml(message.subject)}" title="${message.archived ? "Move to inbox" : "Archive"}">${message.archived ? "↩" : "⌑"}</button></data>
    </article>`;
  }).join("");
  mailList.hidden = visible.length === 0 || openMessageId !== null;
  $("#mail-empty").hidden = visible.length > 0 || openMessageId !== null;
  if (openMessageId !== null) renderReader();
  updateCounts();
}

function renderReader() {
  const message = messages.find((item) => item.id === openMessageId);
  const reader = $("#message-reader");
  if (!message) { openMessageId = null; reader.hidden = true; renderMail(); return; }
  const subject = mailSubject(message.id);
  reader.hidden = false;
  reader.innerHTML = `
    <div class="reader-toolbar">
      <button class="reader-back" type="button">← Back to ${activeFolder}</button>
      <div>
        <data class="mail-action-carrier" value="${message.starred}" rdf-datatype="${NS.xsd}boolean" ${semanticAttrs(subject, `${NS.current}isStarred`)}><button class="star-button${message.starred ? " is-starred" : ""}" type="button" data-reader-action="star" aria-label="${message.starred ? "Unstar" : "Star"} message">${message.starred ? "★" : "☆"}</button></data>
        <data class="mail-action-carrier" value="${message.archived ? "Archive" : "Inbox"}" ${semanticAttrs(subject, `${NS.current}mailbox`)}><button class="archive-button" type="button" data-reader-action="archive" aria-label="${message.archived ? "Move to inbox" : "Archive"} message">${message.archived ? "↩" : "⌑"}</button></data>
      </div>
    </div>
    <h2 class="reader-subject" ${semanticAttrs(subject, `${NS.schema}headline`)}>${escapeHtml(message.subject)}</h2>
    <div class="reader-byline">
      <span class="assignee-avatar" aria-hidden="true">${initials(message.from)}</span>
      <span>From <strong ${semanticAttrs(subject, `${NS.schema}sender`)}>${escapeHtml(message.from)}</strong> to <span ${semanticAttrs(subject, `${NS.schema}recipient`)}>${escapeHtml(message.to)}</span></span>
      <span ${semanticAttrs(subject, `${NS.schema}dateReceived`)}>${escapeHtml(message.time)}</span>
      <data value="${message.read}" rdf-datatype="${NS.xsd}boolean" ${semanticAttrs(subject, `${NS.current}isRead`)}>${message.read ? "Read" : "Unread"}</data>
    </div>
    <p class="reader-body" ${semanticAttrs(subject, `${NS.schema}text`)}>${escapeHtml(message.body)}</p>`;
}

function openMessage(message) {
  message.read = true;
  openMessageId = message.id;
  renderMail();
  showToast("Marked as read. RDF value updated.");
}

function toggleStar(message) {
  message.starred = !message.starred;
  renderMail();
  showToast(`${message.starred ? "Starred" : "Unstarred"}. RDF value updated.`);
}

function toggleArchive(message) {
  message.archived = !message.archived;
  openMessageId = null;
  renderMail();
  showToast(`${message.archived ? "Archived" : "Returned to inbox"}. RDF state updated.`);
}

function switchView(viewName) {
  $$(".rail-link").forEach((button) => {
    const active = button.dataset.view === viewName;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
  $$(".view").forEach((view) => {
    const active = view.id === `${viewName}-view`;
    view.classList.toggle("is-active", active);
    view.hidden = !active;
  });
  $(`#${viewName}-heading`).focus?.();
}

$("#new-issue-button").addEventListener("click", openIssueForm);
$("#issue-form .form-close").addEventListener("click", closeIssueForm);
$("#issue-form .form-cancel").addEventListener("click", closeIssueForm);
$("#issue-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  issues.unshift({ id: issueSequence++, title: String(data.get("title")).trim(), assignee: String(data.get("assignee")).trim(), status: String(data.get("status")), kind: "Product" });
  activeIssueFilter = "All";
  closeIssueForm();
  renderIssues();
  showToast("Issue created. New RDF statements detected.");
});

issueList.addEventListener("change", (event) => {
  if (!event.target.matches(".status-select")) return;
  const row = event.target.closest("[data-issue-id]");
  const issue = issues.find((item) => item.id === Number(row.dataset.issueId));
  issue.status = event.target.value;
  event.target.dataset.state = slugStatus(issue.status);
  const carrier = event.target.closest("[rdf-predicate]");
  carrier.value = issue.status;
  updateCounts();
  showToast(`CUR-${issue.id} moved to ${issue.status}. RDF value updated.`);
});

issueList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const row = button.closest("[data-issue-id]");
  const index = issues.findIndex((item) => item.id === Number(row.dataset.issueId));
  const issue = issues[index];
  if (button.dataset.action === "edit") beginIssueEdit(row, issue);
  if (button.dataset.action === "delete") {
    issues.splice(index, 1);
    renderIssues();
    showToast(`CUR-${issue.id} deleted. RDF statements removed.`);
  }
});

$$('[data-filter]').forEach((button) => button.addEventListener("click", () => {
  activeIssueFilter = button.dataset.filter;
  $$("[data-filter]").forEach((item) => { const selected = item === button; item.classList.toggle("is-selected", selected); item.setAttribute("aria-pressed", String(selected)); });
  renderIssues();
}));
$("#issue-search").addEventListener("input", renderIssues);

$("#compose-button").addEventListener("click", () => { $("#compose-form").hidden = false; $("#compose-form [name=subject]").focus(); });
function closeCompose() { $("#compose-form").hidden = true; $("#compose-form").reset(); $("#compose-form [name=to]").value = "team@example.com"; }
$("#compose-form .form-close").addEventListener("click", closeCompose);
$("#compose-form .form-cancel").addEventListener("click", closeCompose);
$("#compose-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  messages.unshift({ id: mailSequence++, from: "Maya Chen", to: String(data.get("to")).trim(), subject: String(data.get("subject")).trim(), body: String(data.get("body")).trim(), time: "Now", read: true, starred: false, archived: false, sent: true });
  closeCompose(); activeFolder = "sent"; openMessageId = null;
  $$("[data-folder]").forEach((item) => { const selected = item.dataset.folder === activeFolder; item.classList.toggle("is-selected", selected); item.setAttribute("aria-pressed", String(selected)); });
  renderMail(); showToast("Message sent. New RDF statements detected.");
});

mailList.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const message = messages.find((item) => item.id === Number(target.closest("[data-mail-id]").dataset.mailId));
  if (target.dataset.action === "open") openMessage(message);
  if (target.dataset.action === "star") toggleStar(message);
  if (target.dataset.action === "archive") toggleArchive(message);
});
mailList.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches('[data-action="open"]')) { event.preventDefault(); event.target.click(); }
});
$("#message-reader").addEventListener("click", (event) => {
  const message = messages.find((item) => item.id === openMessageId);
  if (event.target.closest(".reader-back")) { openMessageId = null; $("#message-reader").hidden = true; renderMail(); }
  if (event.target.closest('[data-reader-action="star"]')) toggleStar(message);
  if (event.target.closest('[data-reader-action="archive"]')) toggleArchive(message);
});
$$('[data-folder]').forEach((button) => button.addEventListener("click", () => {
  activeFolder = button.dataset.folder; openMessageId = null;
  $$("[data-folder]").forEach((item) => { const selected = item === button; item.classList.toggle("is-selected", selected); item.setAttribute("aria-pressed", String(selected)); });
  $("#message-reader").hidden = true; renderMail();
}));
$("#mail-search").addEventListener("input", () => { openMessageId = null; renderMail(); });

$$('.rail-link').forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
$("#theme-button").addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("#theme-button").setAttribute("aria-label", dark ? "Use light theme" : "Use dark theme");
});
document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "n" && !event.metaKey && !event.ctrlKey && !event.altKey && !/input|textarea|select/i.test(document.activeElement.tagName) && !$("#issues-view").hidden) openIssueForm();
  if (event.key === "Escape") { if (!$("#issue-form").hidden) closeIssueForm(); if (!$("#compose-form").hidden) closeCompose(); }
});

renderIssues();
renderMail();
