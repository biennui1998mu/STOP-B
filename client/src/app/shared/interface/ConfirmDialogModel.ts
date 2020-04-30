export interface ConfirmDialogModel {
  title: string;
  body: string;
  subBody?: string;
  optionCancel: string;
  optionAccept: string;
  cancelClass?: string;
  acceptClass?: string;
}
