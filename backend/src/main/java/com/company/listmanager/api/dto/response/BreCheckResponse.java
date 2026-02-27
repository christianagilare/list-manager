package com.company.listmanager.api.dto.response;

import com.company.listmanager.domain.model.TipoLista;

import java.util.List;

public class BreCheckResponse {
    private boolean found;
    private boolean puedeTransaccionar;
    private List<BreEntryDto> entries;

    public static class BreEntryDto {
        private TipoLista tipoLista;
        private String dni;
        private String wallet;
        private String nombresCompletos;
        private Boolean enListaBlanca;

        public TipoLista getTipoLista() {
            return tipoLista;
        }

        public void setTipoLista(TipoLista tipoLista) {
            this.tipoLista = tipoLista;
        }

        public String getDni() {
            return dni;
        }

        public void setDni(String dni) {
            this.dni = dni;
        }

        public String getWallet() {
            return wallet;
        }

        public void setWallet(String wallet) {
            this.wallet = wallet;
        }

        public String getNombresCompletos() {
            return nombresCompletos;
        }

        public void setNombresCompletos(String nombresCompletos) {
            this.nombresCompletos = nombresCompletos;
        }

        public Boolean getEnListaBlanca() {
            return enListaBlanca;
        }

        public void setEnListaBlanca(Boolean enListaBlanca) {
            this.enListaBlanca = enListaBlanca;
        }
    }

    public boolean isFound() {
        return found;
    }

    public void setFound(boolean found) {
        this.found = found;
    }

    public boolean isPuedeTransaccionar() {
        return puedeTransaccionar;
    }

    public void setPuedeTransaccionar(boolean puedeTransaccionar) {
        this.puedeTransaccionar = puedeTransaccionar;
    }

    public List<BreEntryDto> getEntries() {
        return entries;
    }

    public void setEntries(List<BreEntryDto> entries) {
        this.entries = entries;
    }
}
