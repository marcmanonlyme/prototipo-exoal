package com.exoal.prototipo.controller;

import com.exoal.prototipo.entity.Actividad;
import com.exoal.prototipo.entity.Sede;
import com.exoal.prototipo.entity.Usuario;
import com.exoal.prototipo.repository.ActividadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ActividadControllerTest {

    @Mock
    private ActividadRepository actividadRepository;

    @InjectMocks
    private ActividadController actividadController;

    private Sede sede;
    private Usuario responsable;
    private Actividad actividad1;
    private Actividad actividad2;

    @BeforeEach
    void setUp() {
        sede = new Sede("Plantel Centro", "plantel", "Av. Universidad 123", "555-0101", "centro@univ.edu");
        sede.setIdSede(1L);

        responsable = new Usuario("Docente María", "maria@univ.edu", "hash", "docente", sede);
        responsable.setIdUsuario(3L);

        actividad1 = new Actividad(
                "Conferencia de IA", "Intro a IA", "academica",
                LocalDate.of(2026, 3, 15),
                LocalTime.of(10, 0), LocalTime.of(12, 0),
                "Auditorio A", 100, sede, responsable
        );
        actividad1.setIdActividad(1L);

        actividad2 = new Actividad(
                "Taller de Programación", "Dev web con Java", "extraacademica",
                LocalDate.of(2026, 3, 20),
                LocalTime.of(14, 0), LocalTime.of(16, 0),
                "Laboratorio 5", 30, sede, responsable
        );
        actividad2.setIdActividad(2L);
    }

    @Test
    void getAllActividades_retornaListaCompleta() {
        when(actividadRepository.findAll()).thenReturn(Arrays.asList(actividad1, actividad2));

        List<Actividad> result = actividadController.getAllActividades();

        assertEquals(2, result.size());
        assertEquals("Conferencia de IA", result.get(0).getTitulo());
        verify(actividadRepository, times(1)).findAll();
    }

    @Test
    void getActividadById_existente_retornaActividad() {
        when(actividadRepository.findById(1L)).thenReturn(Optional.of(actividad1));

        Actividad result = actividadController.getActividadById(1L);

        assertNotNull(result);
        assertEquals("academica", result.getTipo());
    }

    @Test
    void getActividadById_noExistente_retornaNull() {
        when(actividadRepository.findById(99L)).thenReturn(Optional.empty());

        Actividad result = actividadController.getActividadById(99L);

        assertNull(result);
    }

    @Test
    void getActividadesBySede_retornaActividadesDeLaSede() {
        when(actividadRepository.findBySedeIdSede(1L)).thenReturn(Arrays.asList(actividad1, actividad2));

        List<Actividad> result = actividadController.getActividadesBySede(1L);

        assertEquals(2, result.size());
        verify(actividadRepository, times(1)).findBySedeIdSede(1L);
    }

    @Test
    void getActividadesByResponsable_retornaActividadesDelResponsable() {
        when(actividadRepository.findByResponsableIdUsuario(3L)).thenReturn(Arrays.asList(actividad1, actividad2));

        List<Actividad> result = actividadController.getActividadesByResponsable(3L);

        assertEquals(2, result.size());
        verify(actividadRepository, times(1)).findByResponsableIdUsuario(3L);
    }

    @Test
    void getActividadesBySede_sinResultados_retornaListaVacia() {
        when(actividadRepository.findBySedeIdSede(99L)).thenReturn(Collections.emptyList());

        List<Actividad> result = actividadController.getActividadesBySede(99L);

        assertTrue(result.isEmpty());
    }

    @Test
    void createActividad_guardaYRetornaActividad() {
        when(actividadRepository.save(any(Actividad.class))).thenReturn(actividad1);

        Actividad result = actividadController.createActividad(actividad1);

        assertNotNull(result);
        assertEquals("programada", result.getEstado());
        verify(actividadRepository, times(1)).save(actividad1);
    }

    @Test
    void updateActividad_existente_actualizaCampos() {
        Actividad detalles = new Actividad(
                "Conferencia Actualizada", "Nueva descripción", "cultural",
                LocalDate.of(2026, 4, 1),
                LocalTime.of(9, 0), LocalTime.of(11, 0),
                "Sala B", 50, sede, responsable
        );
        detalles.setEstado("en_curso");

        when(actividadRepository.findById(1L)).thenReturn(Optional.of(actividad1));
        when(actividadRepository.save(any(Actividad.class))).thenReturn(actividad1);

        Actividad result = actividadController.updateActividad(1L, detalles);

        assertNotNull(result);
        assertEquals("Conferencia Actualizada", actividad1.getTitulo());
        assertEquals("cultural", actividad1.getTipo());
        assertEquals("en_curso", actividad1.getEstado());
        verify(actividadRepository, times(1)).save(actividad1);
    }

    @Test
    void updateActividad_noExistente_retornaNull() {
        when(actividadRepository.findById(99L)).thenReturn(Optional.empty());

        Actividad result = actividadController.updateActividad(99L, actividad1);

        assertNull(result);
        verify(actividadRepository, never()).save(any());
    }

    @Test
    void deleteActividad_llamaDeleteById() {
        doNothing().when(actividadRepository).deleteById(1L);

        actividadController.deleteActividad(1L);

        verify(actividadRepository, times(1)).deleteById(1L);
    }
}
