import { Controller } from 'stimulus';

export default class AlertController extends Controller {
  /**
   * Dialog element, message, and dismiss button.
   */
  public dialogTarget: HTMLElement;
  public messageTarget: HTMLElement;

  static get targets() {
    return ['dialog', 'message', 'dismissButton'];
  }

  public connect() {
    if (this.data.has('message')) {
      this.showDialog();
    }
  }

  public alert(event: CustomEvent) {
    this.messageTarget.innerText = event.detail;
    this.dialogTarget.setAttribute('open', '');
  }

  public confirm(event: CustomEvent) {
    this.messageTarget.innerText = event.detail;
    this.dialogTarget.setAttribute('open', '');
  }

  public dispatchCancellation() {
    window.dispatchEvent(new Event('confirm:cancelled'));
  }

  public dispatchConfirmation() {
    window.dispatchEvent(new Event('confirm:confirmed'));
  }

  public showDialog() {
    window.dispatchEvent(new CustomEvent('alert:show', { detail: this.data.get('message') }));
  }

  public dismissDialog() {
    this.dialogTarget.removeAttribute('open');
  }
}
