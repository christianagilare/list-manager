package com.company.listmanager.api.mapper;

import com.company.listmanager.api.dto.response.EntryResponse;
import com.company.listmanager.domain.model.ListEntry;
import org.springframework.stereotype.Component;

@Component
public class EntryMapper {

    public EntryResponse toResponse(ListEntry entry) {
        if (entry == null) return null;
        EntryResponse r = new EntryResponse();
        r.setId(entry.getId());
        r.setTipoLista(entry.getTipoLista());
        r.setNombresCompletos(entry.getNombresCompletos());
        r.setDni(entry.getDni());
        r.setPaisOrigen(entry.getPaisOrigen());
        r.setWallet(entry.getWallet());
        r.setOficioJustificacion(entry.getOficioJustificacion());
        r.setSourceType(entry.getSourceType());
        r.setFileUploadId(entry.getFileUploadId());
        r.setCreatedAt(entry.getCreatedAt());
        return r;
    }
}
