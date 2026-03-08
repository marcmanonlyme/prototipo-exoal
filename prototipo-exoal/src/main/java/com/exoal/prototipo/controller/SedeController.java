package com.exoal.prototipo.controller;

import com.exoal.prototipo.entity.Sede;
import com.exoal.prototipo.repository.SedeRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Sede getSedeById(@PathVariable Long id) {
        return sedeRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Sede createSede(@RequestBody Sede sede) {
        return sedeRepository.save(sede);
    }

    @PutMapping("/{id}")
    public Sede updateSede(@PathVariable Long id, @RequestBody Sede sedeDetails) {
        Sede sede = sedeRepository.findById(id).orElse(null);
        if (sede != null) {
            sede.setNombre(sedeDetails.getNombre());
            sede.setTipo(sedeDetails.getTipo());
            sede.setDireccion(sedeDetails.getDireccion());
            sede.setTelefono(sedeDetails.getTelefono());
            sede.setCorreoContacto(sedeDetails.getCorreoContacto());
            return sedeRepository.save(sede);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteSede(@PathVariable Long id) {
        sedeRepository.deleteById(id);
    }
}