package com.company.listmanager.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateEntryRequest {

    @NotBlank(message = "nombresCompletos es requerido")
    @Size(max = 500)
    private String nombresCompletos;

    @NotBlank(message = "dni es requerido")
    @Size(max = 50)
    private String dni;

    @NotBlank(message = "paisOrigen es requerido")
    @Size(max = 100)
    private String paisOrigen;

    @NotBlank(message = "wallet es requerido")
    @Size(max = 200)
    private String wallet;

    @NotBlank(message = "oficioJustificacion es requerido")
    @Size(max = 1000)
    private String oficioJustificacion;

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
}
