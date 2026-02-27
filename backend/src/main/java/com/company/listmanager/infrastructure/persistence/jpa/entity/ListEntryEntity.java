package com.company.listmanager.infrastructure.persistence.jpa.entity;

import com.company.listmanager.domain.model.SourceType;
import com.company.listmanager.domain.model.TipoLista;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "list_entry", indexes = {
        @Index(name = "idx_list_entry_tipo_dni", columnList = "tipo_lista, dni"),
        @Index(name = "idx_list_entry_tipo_wallet", columnList = "tipo_lista, wallet"),
        @Index(name = "idx_list_entry_file_upload_id", columnList = "file_upload_id")
})
public class ListEntryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_lista", nullable = false)
    private TipoLista tipoLista;

    @Column(name = "nombres_completos", nullable = false, length = 500)
    private String nombresCompletos;

    @Column(nullable = false, length = 50)
    private String dni;

    @Column(name = "pais_origen", nullable = false, length = 100)
    private String paisOrigen;

    @Column(nullable = false, length = 200)
    private String wallet;

    @Column(name = "oficio_justificacion", nullable = false, length = 1000)
    private String oficioJustificacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false)
    private SourceType sourceType;

    @Column(name = "file_upload_id")
    private UUID fileUploadId;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;

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

    public String getNombresCompletos() {
        return nombresCompletos;
    }

    public void setNombresCompletos(String nombresCompletos) {
        this.nombresCompletos = nombresCompletos;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getPaisOrigen() {
        return paisOrigen;
    }

    public void setPaisOrigen(String paisOrigen) {
        this.paisOrigen = paisOrigen;
    }

    public String getWallet() {
        return wallet;
    }

    public void setWallet(String wallet) {
        this.wallet = wallet;
    }

    public String getOficioJustificacion() {
        return oficioJustificacion;
    }

    public void setOficioJustificacion(String oficioJustificacion) {
        this.oficioJustificacion = oficioJustificacion;
    }

    public SourceType getSourceType() {
        return sourceType;
    }

    public void setSourceType(SourceType sourceType) {
        this.sourceType = sourceType;
    }

    public UUID getFileUploadId() {
        return fileUploadId;
    }

    public void setFileUploadId(UUID fileUploadId) {
        this.fileUploadId = fileUploadId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
