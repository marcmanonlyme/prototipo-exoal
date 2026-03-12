package com.exoal.prototipo.controller;

import com.exoal.prototipo.entity.Sede;
import com.exoal.prototipo.repository.SedeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sedes")
public class SedeController {

    @Autowired
    private SedeRepository sedeRepository;

    @GetMapping
    public List<Sede> getAllSedes() {
        return sedeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sede> getSedeById(@PathVariable Long id) {
        return sedeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Sede createSede(@RequestBody Sede sede) {
        return sedeRepository.save(sede);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sede> updateSede(@PathVariable Long id, @RequestBody Sede sedeDetails) {
        return sedeRepository.findById(id).map(sede -> {
            sede.setNombre(sedeDetails.getNombre());
            sede.setTipo(sedeDetails.getTipo());
            sede.setDireccion(sedeDetails.getDireccion());
            sede.setTelefono(sedeDetails.getTelefono());
            sede.setCorreoContacto(sedeDetails.getCorreoContacto());
            return ResponseEntity.ok(sedeRepository.save(sede));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSede(@PathVariable Long id) {
        if (!sedeRepository.existsById(id)) return ResponseEntity.notFound().build();
        sedeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}