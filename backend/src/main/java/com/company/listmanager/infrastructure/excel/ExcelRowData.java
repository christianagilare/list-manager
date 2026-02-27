package com.company.listmanager.infrastructure.excel;

public class ExcelRowData {
    private String nombresCompletos;
    private String dni;
    private String paisOrigen;
    private String wallet;
    private String oficioJustificacion;

    public ExcelRowData() {
    }

    public ExcelRowData(String nombresCompletos, String dni, String paisOrigen, String wallet, String oficioJustificacion) {
        this.nombresCompletos = nombresCompletos;
        this.dni = dni;
        this.paisOrigen = paisOrigen;
        this.wallet = wallet;
        this.oficioJustificacion = oficioJustificacion;
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
}
