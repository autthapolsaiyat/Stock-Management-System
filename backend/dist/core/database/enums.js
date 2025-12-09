"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FifoTransactionType = exports.DocType = exports.DocStatus = void 0;
var DocStatus;
(function (DocStatus) {
    DocStatus["DRAFT"] = "DRAFT";
    DocStatus["CONFIRMED"] = "CONFIRMED";
    DocStatus["APPROVED"] = "APPROVED";
    DocStatus["ORDERED"] = "ORDERED";
    DocStatus["PARTIALLY_RECEIVED"] = "PARTIALLY_RECEIVED";
    DocStatus["COMPLETED"] = "COMPLETED";
    DocStatus["POSTED"] = "POSTED";
    DocStatus["CANCELLED"] = "CANCELLED";
})(DocStatus || (exports.DocStatus = DocStatus = {}));
var DocType;
(function (DocType) {
    DocType["QT"] = "QT";
    DocType["PO"] = "PO";
    DocType["GR"] = "GR";
    DocType["SI"] = "SI";
    DocType["TR"] = "TR";
    DocType["INV"] = "INV";
})(DocType || (exports.DocType = DocType = {}));
var FifoTransactionType;
(function (FifoTransactionType) {
    FifoTransactionType["GRN"] = "GRN";
    FifoTransactionType["ISSUE"] = "ISSUE";
    FifoTransactionType["SALES"] = "SALES";
    FifoTransactionType["TRANSFER_IN"] = "TRANSFER_IN";
    FifoTransactionType["TRANSFER_OUT"] = "TRANSFER_OUT";
    FifoTransactionType["ADJUSTMENT_IN"] = "ADJUSTMENT_IN";
    FifoTransactionType["ADJUSTMENT_OUT"] = "ADJUSTMENT_OUT";
})(FifoTransactionType || (exports.FifoTransactionType = FifoTransactionType = {}));
//# sourceMappingURL=enums.js.map