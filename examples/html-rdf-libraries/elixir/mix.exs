defmodule HtmlRdfLibraryExample.MixProject do
  use Mix.Project

  def project, do: [app: :html_rdf_library_example, version: "0.0.0", elixir: "~> 1.18", deps: deps()]
  def application, do: [extra_applications: [:logger]]
  defp deps, do: [{:req, "~> 0.5"}, {:floki, "~> 0.38"}, {:html5ever, "~> 0.18"}]
end
