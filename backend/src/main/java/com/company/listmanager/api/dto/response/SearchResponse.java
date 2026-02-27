package com.company.listmanager.api.dto.response;

import java.util.List;

public class SearchResponse {
    private List<EntryResponse> content;
    private long totalElements;
    private int page;

    public SearchResponse() {
    }

    public SearchResponse(List<EntryResponse> content, long totalElements, int page) {
        this.content = content;
        this.totalElements = totalElements;
        this.page = page;
    }

    public List<EntryResponse> getContent() {
        return content;
    }

    public void setContent(List<EntryResponse> content) {
        this.content = content;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }
}
