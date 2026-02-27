package com.company.listmanager.application.usecase;

import com.company.listmanager.application.port.out.EntryRepositoryPort;
import com.company.listmanager.domain.model.ListEntry;
import com.company.listmanager.domain.model.SourceType;
import com.company.listmanager.domain.model.TipoLista;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CreateEntryUseCase {

    private static final Logger log = LoggerFactory.getLogger(CreateEntryUseCase.class);

    private final EntryRepositoryPort entryRepository;

    public CreateEntryUseCase(EntryRepositoryPort entryRepository) {
        this.entryRepository = entryRepository;
    }

    public ListEntry execute(TipoLista tipoLista, String nombresCompletos, String dni, String paisOrigen,
                             String wallet, String oficioJustificacion) {
        log.info("CreateEntryUseCase: tipoLista={}", tipoLista);

        ListEntry entry = new ListEntry();
        entry.setTipoLista(tipoLista);
        entry.setNombresCompletos(nombresCompletos);
        entry.setDni(dni);
        entry.setPaisOrigen(paisOrigen);
        entry.setWallet(wallet);
        entry.setOficioJustificacion(oficioJustificacion);
        entry.setSourceType(SourceType.MANUAL);
        entry.setFileUploadId(null);

        ListEntry saved = entryRepository.save(entry);
        log.info("CreateEntryUseCase finished: id={}", saved.getId());
        return saved;
    }
}
