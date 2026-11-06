import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyCommand } from "@/components/copy-command";

const COMMAND = "curl -fsSL https://get.databasify.io/install.sh | sudo bash";

async function clickCopy() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Copy install command" }));
  });
}

describe("CopyCommand", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("copies via clipboard API and shows Copied", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<CopyCommand command={COMMAND} />);

    await clickCopy();

    expect(writeText).toHaveBeenCalledWith(COMMAND);
    expect(screen.getByRole("button", { name: "Copied" })).toBeDefined();
  });

  it("falls back to selecting the text when clipboard API is missing", async () => {
    vi.stubGlobal("navigator", {});
    render(<CopyCommand command={COMMAND} />);

    await clickCopy();

    expect(window.getSelection()?.toString()).toBe(COMMAND);
    expect(screen.getByRole("button", { name: "Copied" })).toBeDefined();
  });
});
