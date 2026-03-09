import { configure } from "@testing-library/dom";

configure({
  getElementError: (message) => {
    return new Error(message); // no DOM dump
  }
});