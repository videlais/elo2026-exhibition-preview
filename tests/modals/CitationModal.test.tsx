import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CitationModal from "../../src/components/modals/CitationModal";

vi.mock("../../src/components/citation/CitationWidget", () => ({
	CitationWidget: ({ citeKey, citation }: { citeKey: string; citation: string | Record<string, unknown> }) => (
		<div data-testid="citation-widget-mock">
			<span>{citeKey}</span>
			<span>{typeof citation === "string" ? citation : JSON.stringify(citation)}</span>
		</div>
	),
}));

describe("CitationModal", () => {
	const props = {
		show: true,
		onHide: vi.fn(),
		title: "Cite this Editorial Statement",
		citeKey: "lovelace-editorial",
		citation: {
			type: "chapter",
			id: "lovelace-2024",
			title: "Citation Work",
		},
	};

	beforeEach(() => {
		props.onHide.mockClear();
	});

	it("renders modal title and close control when open", () => {
		render(<CitationModal {...props} />);

		expect(screen.getByText(props.title)).toBeInTheDocument();
		expect(screen.getByText("Close")).toBeInTheDocument();
	});

	it("does not render modal body content when closed", () => {
		render(<CitationModal {...props} show={false} />);

		expect(screen.queryByTestId("citation-widget-mock")).toBeNull();
	});

	it("calls onHide when footer close button is clicked", () => {
		render(<CitationModal {...props} />);

		fireEvent.click(screen.getByText("Close"));

		expect(props.onHide).toHaveBeenCalledTimes(1);
	});

	it("passes citeKey and citation to CitationWidget", () => {
		render(<CitationModal {...props} />);

		expect(screen.getByTestId("citation-widget-mock")).toBeInTheDocument();
		expect(screen.getByText(props.citeKey)).toBeInTheDocument();
		expect(screen.getByText(JSON.stringify(props.citation))).toBeInTheDocument();
	});
});
