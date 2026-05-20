import { LitElementWw } from '@webwriter/lit';
import { LitElement, PropertyValueMap, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import periodicTable from '../periodicTable.json';
import elementsLocalized from '../elementsLocalized.json';

import { PeriodicTableStyles } from './PeriodicTableStyles';

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
    static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

    @property({ type: Object, attribute: true, reflect: true })
    private accessor selectedElement: Element = periodicTable.elements[0] as Element;

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
        if (this.lang in elementsLocalized) {
            const localizedElement = (elementsLocalized as any)[this.lang][String(number)];
            return localizedElement ?? enName;
        }
        return enName;
    }
}
