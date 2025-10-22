package com.messaway.backend.repository;

import com.messaway.backend.model.Casa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CasaRepository extends JpaRepository<Casa, Long> {
}
