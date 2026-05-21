# Chemdraw (`@webwriter/chemdraw@2.1.1`)
[License: MIT](LICENSE) | Version: 2.1.1

Periodic table of the elements. Each element can be focused on to get a brief overview of its properties.





## `PeriodicTable` (`<webwriter-periodic-table>`)


### Usage

Use with a CDN (e.g. [jsdelivr](https://jsdelivr.com)):
```html
<link href="https://cdn.jsdelivr.net/npm/@webwriter/chemdraw/widgets/webwriter-periodic-table.css" rel="stylesheet">
<script type="module" src="https://cdn.jsdelivr.net/npm/@webwriter/chemdraw/widgets/webwriter-periodic-table.js"></script>
<webwriter-periodic-table></webwriter-periodic-table>
```

Or use with a bundler (e.g. [Vite](https://vite.dev)):

```
npm install @webwriter/chemdraw
```

```html
<link href="@webwriter/chemdraw/widgets/webwriter-periodic-table.css" rel="stylesheet">
<script type="module" src="@webwriter/chemdraw/widgets/webwriter-periodic-table.js"></script>
<webwriter-periodic-table></webwriter-periodic-table>
```

## Fields
| Name (Attribute Name) | Type | Description | Default | Reflects |
| :-------------------: | :--: | :---------: | :-----: | :------: |
| `selectedElement` (`selectedElement`) | `Element` | The element object of the selected element | `periodicTable.elements[0]` | ✓ |

*Fields including [properties](https://developer.mozilla.org/en-US/docs/Glossary/Property/JavaScript) and [attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute) define the current state of the widget and offer customization options.*

## Events
| Name | Description |
| :--: | :---------: |
| focus | - |

*[Events](https://developer.mozilla.org/en-US/docs/Web/Events) are dispatched by the widget after certain triggers.*

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public methods, slots, custom CSS properties, or CSS parts.*


---
*Generated with @webwriter/build@1.9.0*
