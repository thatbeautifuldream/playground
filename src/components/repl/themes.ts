import { EditorView } from "@codemirror/view";
import {
  defaultHighlightStyle,
  HighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import type { Extension } from "@codemirror/state";

const lightEditorTheme = EditorView.theme(
  {
    "&": { color: "#000" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#000" },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, ::selection":
      { backgroundColor: "#b4d8ff" },
    ".cm-selectionBackground": { backgroundColor: "#d4e6f9" },
    ".cm-activeLine": { backgroundColor: "#0000000a" },
    ".cm-gutters": {
      backgroundColor: "transparent",
      color: "#6e6e6e",
      border: "none",
    },
    ".cm-activeLineGutter": { backgroundColor: "#0000000a", color: "#000" },
    ".cm-matchingBracket": {
      backgroundColor: "#b4d8ff66",
      outline: "1px solid #0550ae",
    },
  },
  { dark: false }
);

export const lightTheme: Extension = [
  lightEditorTheme,
  syntaxHighlighting(defaultHighlightStyle),
];

const darkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#d98ff2" },
  { tag: [t.atom, t.bool, t.url, t.contentSeparator, t.labelName], color: "#8fb8ff" },
  { tag: [t.literal, t.inserted], color: "#7ee787" },
  { tag: [t.string, t.deleted], color: "#ff9e9e" },
  { tag: [t.regexp, t.escape, t.special(t.string)], color: "#ffa657" },
  { tag: t.definition(t.variableName), color: "#79c0ff" },
  { tag: t.local(t.variableName), color: "#79c0ff" },
  { tag: [t.typeName, t.namespace], color: "#5fd7c4" },
  { tag: t.className, color: "#5fd7e0" },
  { tag: [t.special(t.variableName), t.macroName], color: "#ffab70" },
  { tag: t.definition(t.propertyName), color: "#79c0ff" },
  { tag: t.propertyName, color: "#9ecbff" },
  { tag: t.comment, color: "#9ea7b3", fontStyle: "italic" },
  { tag: t.meta, color: "#bfa3ff" },
  { tag: t.invalid, color: "#ff6b6b" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.link, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "#79c0ff" },
]);

const darkEditorTheme = EditorView.theme(
  {
    "&": { color: "#f0f3f6" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#fff" },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, ::selection":
      { backgroundColor: "#28527a" },
    ".cm-selectionBackground": { backgroundColor: "#233a52" },
    ".cm-activeLine": { backgroundColor: "#ffffff0a" },
    ".cm-gutters": {
      backgroundColor: "transparent",
      color: "#9198a1",
      border: "none",
    },
    ".cm-activeLineGutter": { backgroundColor: "#ffffff0a", color: "#f0f3f6" },
    ".cm-matchingBracket": {
      backgroundColor: "#28527a66",
      outline: "1px solid #79c0ff",
    },
    ".cm-searchMatch": {
      backgroundColor: "#f2cc6044",
      outline: "1px solid #f2cc60",
    },
    ".cm-searchMatch.cm-searchMatch-selected": { backgroundColor: "#f2cc6077" },
    ".cm-panels": { backgroundColor: "#1c2128", color: "#f0f3f6" },
    ".cm-tooltip": {
      backgroundColor: "#1c2128",
      border: "1px solid #444c56",
      color: "#f0f3f6",
    },
    ".cm-tooltip-autocomplete ul li[aria-selected]": {
      backgroundColor: "#28527a",
      color: "#f0f3f6",
    },
  },
  { dark: true }
);

export const darkTheme: Extension = [
  darkEditorTheme,
  syntaxHighlighting(darkHighlightStyle),
];
