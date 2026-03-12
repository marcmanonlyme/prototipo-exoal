package com.exoal.prototipo.controller;

import com.exoal.prototipo.entity.Actividad;
import com.exoal.prototipo.repository.ActividadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actividades")
public class ActividadController {

    @Autowired
    private ActividadRepository actividadRepository;

    @GetMapping
    public List<Actividad> getAllActividades() {
        return actividadRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Actividad> getActividadById(@PathVariable Long id) {
        return actividadRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sede/{sedeId}")
    public List<Actividad> getActividadesBySede(@PathVariable Long sedeId) {
        return actividadRepository.findBySedeIdSede(sedeId);
    }

    @GetMapping("/responsable/{usuarioId}")
    public List<Actividad> getActividadesByResponsable(@PathVariable Long usuarioId) {
        return actividadRepository.findByResponsableIdUsuario(usuarioId);
    }

    @PostMapping
    public Actividad createActividad(@RequestBody Actividad actividad) {
        return actividadRepository.save(actividad);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Actividad> updateActividad(@PathVariable Long id, @RequestBody Actividad actividadDetails) {
        return actividadRepository.findById(id).map(actividad -> {
            actividad.setTitulo(actividadDetails.getTitulo());
            actividad.setDescripcion(actividadDetails.getDescripcion());
            actividad.setTipo(actividadDetails.getTipo());
            actividad.setFechaInicio(actividadDetails.getFechaInicio());
            actividad.setHoraInicio(actividadDetails.getHoraInicio());
            actividad.setHoraFin(actividadDetails.getHoraFin());
            actividad.setUbicacion(actividadDetails.getUbicacion());
            actividad.setCapacidad(actividadDetails.getCapacidad());
            actividad.setEstado(actividadDetails.getEstado());
            actividad.setSede(actividadDetails.getSede());
            actividad.setResponsable(actividadDetails.getResponsable());
            return ResponseEntity.ok(actividadRepository.save(actividad));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActividad(@PathVariable Long id) {
        if (!actividadRepository.existsById(id)) return ResponseEntity.notFound().build();
        actividadRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
