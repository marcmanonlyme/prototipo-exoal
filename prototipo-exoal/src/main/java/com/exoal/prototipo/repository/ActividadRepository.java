package com.exoal.prototipo.repository;

import com.exoal.prototipo.entity.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    List<Actividad> findByResponsableIdUsuario(Long responsableId);
    List<Actividad> findBySedeIdSede(Long sedeId);
}