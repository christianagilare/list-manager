package com.company.listmanager.infrastructure.persistence.adapter;

import com.company.listmanager.application.port.out.EntryRepositoryPort;
import com.company.listmanager.domain.model.ListEntry;
import com.company.listmanager.infrastructure.persistence.jpa.entity.ListEntryEntity;
import com.company.listmanager.infrastructure.persistence.jpa.repository.ListEntryJpaRepository;
import org.springframework.stereotype.Component;

@Component
public class JpaEntryRepositoryAdapter implements EntryRepositoryPort {

    private final ListEntryJpaRepository jpaRepository;

    public JpaEntryRepositoryAdapter(ListEntryJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public ListEntry save(ListEntry entry) {
        ListEntryEntity entity = toEntity(entry);
        ListEntryEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    private ListEntry toDomain(ListEntryEntity e) {
        ListEntry d = new ListEntry();
        d.setId(e.getId());
        d.setTipoLista(e.getTipoLista());
        d.setNombresCompletos(e.getNombresCompletos());
        d.setDni(e.getDni());
        d.setPaisOrigen(e.getPaisOrigen());
        d.setWallet(e.getWallet());
        d.setOficioJustificacion(e.getOficioJustificacion());
        d.setSourceType(e.getSourceType());
        d.setFileUploadId(e.getFileUploadId());
        d.setCreatedAt(e.getCreatedAt());
        return d;
    }

    private ListEntryEntity toEntity(ListEntry d) {
        ListEntryEntity e = new ListEntryEntity();
        e.setId(d.getId());
        e.setTipoLista(d.getTipoLista());
        e.setNombresCompletos(d.getNombresCompletos());
        e.setDni(d.getDni());
        e.setPaisOrigen(d.getPaisOrigen());
        e.setWallet(d.getWallet());
        e.setOficioJustificacion(d.getOficioJustificacion());
        e.setSourceType(d.getSourceType());
        e.setFileUploadId(d.getFileUploadId());
        e.setCreatedAt(d.getCreatedAt());
        return e;
    }
}
