/* eslint-disable max-classes-per-file */
import { vi } from 'vitest';

export const FormCancelationReason = {
    UserBusy: 'UserBusy',
    UserClosed: 'UserClosed',
};

export const uiManager = {
    closeAllForms: vi.fn(),
};

export class ModalFormData {}
export class ActionFormData {}

class Observable {
    #data
    #options

    constructor(initialData, options = {}) {
        this.#data = initialData
        this.#options = options
    }

    get options() { return this.#options }

    getData() { return this.#data }
    setData(data) { this.#data = data }
}

export class ObservableNumber extends Observable {}
export class ObservableString extends Observable {}
export class ObservableBoolean extends Observable {}
export class ObservableUIRawMessage extends Observable {}

export class CustomForm {
    static instances = []

    controls = []
    isShowing = false

    constructor(player, title) {
        this.player = player
        this.title = title
        CustomForm.instances.push(this)
    }

    #add(type, details) {
        this.controls.push({ type, ...details })
        return this
    }

    button = vi.fn((label, onClick, options) => this.#add('button', { label, onClick, options }))
    closeButton = vi.fn((options) => this.#add('closeButton', { options }))
    divider = vi.fn(() => this.#add('divider', {}))
    dropdown = vi.fn((label, observable, items, options) => this.#add('dropdown', { label, observable, items, options }))
    header = vi.fn((label, options) => this.#add('header', { label, options }))
    label = vi.fn((label, options) => this.#add('label', { label, options }))
    slider = vi.fn((label, observable, min, max, options) => this.#add('slider', { label, observable, min, max, options }))
    spacer = vi.fn(() => this.#add('spacer', {}))
    textField = vi.fn((label, observable, options) => this.#add('textField', { label, observable, options }))
    toggle = vi.fn((label, observable, options) => this.#add('toggle', { label, observable, options }))
    show = vi.fn(() => { this.isShowing = true })
    close = vi.fn(() => { this.isShowing = false })

    getControl(type) {
        return this.controls.find(control => control.type === type)
    }
}
