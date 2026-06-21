import { Button, Tab, Tabs } from "react-bootstrap";
import { Clipboard } from "react-bootstrap-icons";
import { useState } from "react";
import '@citation-js/plugin-csl';
import '@citation-js/plugin-bibtex';
import { Cite, plugins, util } from '@citation-js/core';
import "./CitationWidget.css";

let citationTemplatesRegistered = false;

function ensureCitationTemplatesRegistered() {
  if (citationTemplatesRegistered) {
    return;
  }

  const mlaTemplate = util.fetchFile('https://www.zotero.org/styles/modern-language-association');
  const chicagoTemplate = util.fetchFile('https://www.zotero.org/styles/chicago-author-date');

  const cslConfig = plugins.config.get("@csl");
  cslConfig.templates.add('mla', mlaTemplate);
  cslConfig.templates.add('chicago', chicagoTemplate);

  const btConfig = plugins.config.get('@bibtex');
  btConfig.constants.fieldTypes.doi = ["field", "literal"];

  citationTemplatesRegistered = true;
}

export function CitationWidget({ citation, citeKey }: { citation: string | Record<string, unknown>, citeKey: string }): JSX.Element {
  const [activeStyle, setActiveStyle] = useState("apa");

  ensureCitationTemplatesRegistered();
  const config = plugins.config.get("@csl");
  const example = new Cite(citation, config);
  const apaoutput = example.format('bibliography', {
    format: 'html',
    template: 'apa',
    lang: 'en-US'
  });
  const apatext = example.format('bibliography', {
    format: 'text',
    template: 'apa',
    lang: 'en-US'
  });
  const mlaoutput = example.format('bibliography', {
    format: 'html',
    template: 'mla',
    lang: 'en-US'
  });
  const mlatext = example.format('bibliography', {
    format: 'text',
    template: 'mla',
    lang: 'en-US'
  });
  const chicagooutput = example.format('bibliography', {
    format: 'html',
    template: 'chicago',
    lang: 'en-US'
  });
  const chicagotext = example.format('bibliography', {
    format: 'text',
    template: 'chicago',
    lang: 'en-US'
  });
  const bibtexOutput = example.format('bibtex');
  const citationTextByStyle: Record<string, string> = {
    apa: apatext,
    mla: mlatext,
    chicago: chicagotext,
  };

  const currentCitationText = citationTextByStyle[activeStyle] ?? apatext;

  function downloadBibTeX() {
    const blob = new Blob([bibtexOutput], { type: 'text/plain;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${citeKey || 'citation'}.bib`;
    link.click();
  }

  function copyCurrentCitation() {
    navigator.clipboard.writeText(currentCitationText);
  }

  return (
    <div>
      <div className="citationWidgetActions">
        {activeStyle === "bibtex" ? null : (
          <Button
            variant="secondary"
            className="citationWidgetCopyButton"
            size="sm"
            aria-label={`Copy ${activeStyle} citation`}
            onClick={copyCurrentCitation}
          >
            <Clipboard size={16} aria-hidden="true" />
          </Button>
        )}
      </div>

      <Tabs
        activeKey={activeStyle}
        onSelect={(key) => setActiveStyle(key ?? "apa")}
        id="citation-style-tabs"
        className="mb-3"
        variant="pills"
      >
        <Tab eventKey="apa" title="apa">
          <p className="citationWidgetEntry">
          <span dangerouslySetInnerHTML={{ __html: apaoutput }}></span>
        </p>
      </Tab>
      <Tab eventKey="mla" title="mla">
        <p className="citationWidgetEntry">
          <span dangerouslySetInnerHTML={{ __html: mlaoutput }}></span>
        </p>
      </Tab>
      <Tab eventKey="chicago" title="chicago">
        <p className="citationWidgetEntry">
          <span dangerouslySetInnerHTML={{ __html: chicagooutput }}></span>
        </p>
      </Tab>
      <Tab eventKey="bibtex" title="bibtex">
        <div>
          <Button size="sm" onClick={downloadBibTeX}>Download BibTeX</Button>
        </div>
      </Tab>
      </Tabs>
    </div>
  );
}
