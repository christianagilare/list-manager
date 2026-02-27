package com.company.listmanager.application.port.out;

import com.company.listmanager.domain.model.ListEntry;

public interface EntryRepositoryPort {

    ListEntry save(ListEntry entry);
}
