import { fireEvent, getByText } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

let dom;
let container;

describe("index.html", () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    container = dom.window.document.body;
  });

  it("renders a heading element with correct title", () => {
    expect(container.querySelector("h1")).not.toBeNull();
    expect(
      getByText(container, "Productivity Tracker App")
    ).toBeInTheDocument();
  });

  it("renders a heading element with correct name", () => {
    const h4 = container.querySelectorAll("h4");
    let nama;
    h4.forEach((element) => {
      if (element.textContent.includes("Nama:")) {
        nama = element;
      }
    });
    expect(nama).not.toBeNull();
  });

  it("renders a heading element with correct NRP", () => {
    const h4 = container.querySelectorAll("h4");
    let nrp;
    h4.forEach((element) => {
      if (element.textContent.includes("NRP:")) {
        nrp = element;
      }
    });
    expect(nrp).not.toBeNull();
    const value = nrp.textContent.replace("NRP: ", "");
    expect(value.startsWith("5025")).toBe(true);
  });

  it("renders a heading element with correct current activity title", () => {
    expect(container.querySelector("h2")).not.toBeNull();
    expect(getByText(container, "Current Activity")).toBeInTheDocument();
  });

  it("renders button elements", () => {
    const buttons = container.querySelectorAll("button");
    expect(buttons).not.toBeNull();
  });

  it("renders a paragraph element", () => {
    expect(container.querySelector("p")).not.toBeNull();
  });

  it("renders a list of current activities", () => {
    const ul = container.querySelector("ul");
    expect(ul).not.toBeNull();
    expect(ul.children.length).toBe(3);
  });

  it("renders a heading element with correct past activity title", () => {
    expect(container.querySelector("h2")).not.toBeNull();
    expect(getByText(container, "Past Activity")).toBeInTheDocument();
  });

  it("renders a table with correct headers", () => {
    const table = container.querySelector("table");
    expect(table).not.toBeNull();
    const headers = table.querySelectorAll("th");
    expect(headers.length).toBe(3);
    expect(getByText(headers[0], "Activity")).toBeInTheDocument();
    expect(getByText(headers[1], "Time")).toBeInTheDocument();
    expect(getByText(headers[2], "Performance")).toBeInTheDocument();
  });

  it("renders a table with correct data", () => {
    const table = container.querySelector("table");
    expect(table).not.toBeNull();
    const rows = table.querySelectorAll("tr");
    expect(rows.length).toBe(4);
  });
});
