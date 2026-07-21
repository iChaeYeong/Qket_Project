package com.exam.reservation.dto;

import org.apache.ibatis.type.Alias;

@Alias("TransactionDTO")
public class TransactionDTO {

    int tranId;
    String frmAccountNo;
    String toAccountNo;
    int tranAmt;
    String tranDt;

    public TransactionDTO() {}

    public TransactionDTO(int tranId, String frmAccountNo, String toAccountNo, int tranAmt, String tranDt) {
        this.tranId = tranId;
        this.frmAccountNo = frmAccountNo;
        this.toAccountNo = toAccountNo;
        this.tranAmt = tranAmt;
        this.tranDt = tranDt;
    }

    public int getTranId() { return tranId; }
    public void setTranId(int tranId) { this.tranId = tranId; }

    public String getFrmAccountNo() { return frmAccountNo; }
    public void setFrmAccountNo(String frmAccountNo) { this.frmAccountNo = frmAccountNo; }

    public String getToAccountNo() { return toAccountNo; }
    public void setToAccountNo(String toAccountNo) { this.toAccountNo = toAccountNo; }

    public int getTranAmt() { return tranAmt; }
    public void setTranAmt(int tranAmt) { this.tranAmt = tranAmt; }

    public String getTranDt() { return tranDt; }
    public void setTranDt(String tranDt) { this.tranDt = tranDt; }

    @Override
    public String toString() {
        return "TransactionDTO{tranId=" + tranId + ", frmAccountNo='" + frmAccountNo
                + "', toAccountNo='" + toAccountNo + "', tranAmt=" + tranAmt + "}";
    }
}
