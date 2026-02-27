package com.company.listmanager.api.dto.response;

import com.company.listmanager.domain.model.SourceType;
import com.company.listmanager.domain.model.TipoLista;

import java.time.Instant;
import java.util.UUID;

public class EntryResponse {
    private UUID id;
    private TipoLista tipoLista;
    private String nombresCompletos;
    private String dni;
    private String paisOrigen;
    private String wallet;
    private String oficioJustificacion;
    private SourceType sourceType;
    private UUID fileUploadId;
    private Instant createdAt;
    private Boolean enListaBlanca;
    private Boolean puedeTransaccionar;

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

    public Boolean getEnListaBlanca() {
        return enListaBlanca;
    }

    public void setEnListaBlanca(Boolean enListaBlanca) {
        this.enListaBlanca = enListaBlanca;
    }

    public Boolean getPuedeTransaccionar() {
        return puedeTransaccionar;
    }

    public void setPuedeTransaccionar(Boolean puedeTransaccionar) {
        this.puedeTransaccionar = puedeTransaccionar;
    }
}
