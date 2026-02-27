package com.company.listmanager.domain.model;

import java.time.Instant;
import java.util.UUID;

public class FileUpload {
    private UUID id;
    private TipoLista tipoLista;
    private String objectKey;
    private String originalFilename;
    private String uploadedBy;
    private Instant uploadedAt;
    private UploadStatus status;
    private int totalRows;
    private int insertedRows;
    private int rejectedRows;
    private String errorReport;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public TipoLista getTipoLista() {
        return tipoLista;
    }

    public void setTipoLista(TipoLista tipoLista) {
        this.tipoLista = tipoLista;
    }

    public String getObjectKey() {
        return objectKey;
    }

    public void setObjectKey(String objectKey) {
        this.objectKey = objectKey;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public UploadStatus getStatus() {
        return status;
    }

    public void setStatus(UploadStatus status) {
        this.status = status;
    }

    public int getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(int totalRows) {
        this.totalRows = totalRows;
    }

    public int getInsertedRows() {
        return insertedRows;
    }

    public void setInsertedRows(int insertedRows) {
        this.insertedRows = insertedRows;
    }

    public int getRejectedRows() {
        return rejectedRows;
    }

    public void setRejectedRows(int rejectedRows) {
        this.rejectedRows = rejectedRows;
    }

    public String getErrorReport() {
        return errorReport;
    }

    public void setErrorReport(String errorReport) {
        this.errorReport = errorReport;
    }
}
