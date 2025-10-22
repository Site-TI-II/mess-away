package com.messaway.backend.controller;

import com.messaway.backend.model.Casa;
import com.messaway.backend.repository.CasaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/casas")
public class CasaController {

    @Autowired
    private CasaRepository casaRepository;

    @GetMapping
    public List<Casa> listar() {
        return casaRepository.findAll();
    }

    @PostMapping
    public Casa criar(@RequestBody Casa casa) {
        return casaRepository.save(casa);
    }

    @PutMapping("/{id}")
    public Casa atualizar(@PathVariable Long id, @RequestBody Casa nova) {
        Casa casa = casaRepository.findById(id).orElseThrow();
        casa.setNome(nova.getNome());
        casa.setEndereco(nova.getEndereco());
        return casaRepository.save(casa);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        casaRepository.deleteById(id);
    }
}
