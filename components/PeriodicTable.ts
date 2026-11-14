import { LitElementWw } from '@webwriter/lit';
import { LitElement, TemplateResult, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import periodicTable from '../periodicTable.json';
import elementsLocalized from '../elementsLocalized.json';

import { PeriodicTableStyles } from './PeriodicTableStyles';

const elementNames = new Map(
    Object.entries(elementsLocalized).map(([language, names]) =>
        [language.toLowerCase(), names as Record<string, string>]),
);
const defaultLocales = new Map([
    ['no', 'nb'],
    ['pt', 'pt-pt'],
    ['zh', 'zh-hans'],
]);

function ancestor(node: Node) {
    const root = node.getRootNode();
    return node.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
}

export interface Element {
    name: string;
    atomic_mass: number;
    category: string;
    number: number;
    symbol: string;
    xpos: number;
    ypos: number;
    electron_configuration_semantic: string;
    electronegativity_pauling: number | null;
    ionization_energies: number[];
}

@customElement('webwriter-periodic-table')
export class PeriodicTable extends LitElementWw {
    static styles = PeriodicTableStyles;
    /** @internal */
    static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

    /** The element object of the selected element */
    @state()
    accessor selectedElement: Element = periodicTable.elements[0] as Element;

    static override properties = { lang: { attribute: false, noAccessor: true } };

    override get lang() {
        for (let node: Node | null = this; node; node = ancestor(node)) {
            if (node instanceof HTMLElement && node.hasAttribute('lang')) {
                return node.getAttribute('lang')!;
            }
        }
        return '';
    }

    override set lang(value: string) {
        this.setAttribute('lang', value);
    }

    private readonly languageObserver = new MutationObserver(() => this.requestUpdate());

    override connectedCallback() {
        super.connectedCallback();
        for (let element: Node | null = this; element; element = ancestor(element)) {
            this.languageObserver.observe(element, { attributes: true, attributeFilter: ['lang'] });
        }
    }

    override disconnectedCallback() {
        this.languageObserver.disconnect();
        super.disconnectedCallback();
    }

    /** @internal */
    focus() {
        console.log('focus');
        this.dispatchEvent(new CustomEvent('focus'));
    }

    render() {
        return html`
            <div class="periodic-table">
                <div class="selected-element" style="grid-column: 5/8; grid-row: 1/4;">
                    <div class="element-number">${this.selectedElement.number}</div>
                    <div class="element-symbol">${this.selectedElement.symbol}</div>
                    <div class="element-name">${this.getLocalizedName(this.selectedElement.number, this.selectedElement.name)}</div>
                    <div class="element-mass">${this.selectedElement.atomic_mass.toFixed(3)}</div>
                    <div class="element-electron-configuration">
                        ${this.formatElectronConfiguration(this.selectedElement.electron_configuration_semantic)}
                    </div>
                    <div class="element-first-ionization-energy">${this.selectedElement.ionization_energies[0]}</div>
                    <div class="element-electronegativity">${this.selectedElement.electronegativity_pauling}</div>
                </div>
                ${Object.entries(periodicTable.elements as Element[]).map(([key, value]) => {
                    return html`
                        <div
                            class=${`element ${value.category}`}
                            style="grid-column: ${value.xpos}; grid-row: ${value.ypos};"
                            @click=${() => {
                                const e = new CustomEvent('element-click', {
                                    detail: { element: value },
                                    bubbles: true,
                                    composed: true,
                                });
                                this.dispatchEvent(e);
                                this.selectedElement = value;
                                this.focus();
                            }}
                        >
                            <div class="element-number">${value.number}</div>
                            <div class="element-symbol">${value.symbol}</div>

                            <!-- <div class="hover-only">
                                <div class="element-name">${value.name}</div>
                                <div class="element-mass">${value.atomic_mass}</div>
                            </div> -->
                        </div>
                    `;
                })}
            </div>
        `;
    }

    private formatElectronConfiguration(configuration: string): TemplateResult {
        const parts = configuration.split(' ');
        const brackets = ['[', '*'].includes(parts[0][0]) ? parts[0] : null;

        const config = parts.slice(brackets ? 1 : 0).map((part) => {
            const subparts = part.split(new RegExp('([A-Za-z]+)'));
            return html` ${subparts[0]}${subparts[1]}<sup>${subparts[2]}</sup> `;
        });

        return html` ${brackets} ${config}`;
    }

    private getLocalizedName(number: number, enName: string): string {
        const tag = this.lang.trim().toLowerCase();
        const language = tag.split('-')[0];
        let locale = tag;
        if (/^zh-/.test(tag) && !elementNames.has(tag)) {
            try {
                const script = new Intl.Locale(tag).maximize().script;
                locale = script ? `zh-${script.toLowerCase()}` : tag;
            } catch {
                locale = tag;
            }
        }
        return elementNames.get(locale)?.[number]
            ?? elementNames.get(language)?.[number]
            ?? elementNames.get(defaultLocales.get(language) ?? '')?.[number]
            ?? enName;
    }
}
