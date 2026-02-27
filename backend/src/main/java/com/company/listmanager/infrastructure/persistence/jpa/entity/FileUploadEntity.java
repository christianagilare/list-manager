package com.company.listmanager.infrastructure.persistence.jpa.entity;

import com.company.listmanager.domain.model.TipoLista;
import com.company.listmanager.domain.model.UploadStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "file_upload")
public class FileUploadEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_lista", nullable = false)
    private TipoLista tipoLista;

    @Column(name = "object_key", nullable = false, length = 500)
    private String objectKey;

    @Column(name = "original_filename", nullable = false, length = 255)
    private String originalFilename;

    @Column(name = "uploaded_by", length = 255)
    private String uploadedBy;

    @Column(name = "uploaded_at", nullable = false)
    private Instant uploadedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UploadStatus status;

    @Column(name = "total_rows")
    private int totalRows;

    @Column(name = "inserted_rows")
    private int insertedRows;

    @Column(name = "rejected_rows")
    private int rejectedRows;

    @Column(name = "error_report", length = 10000)
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
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
