package com.exoal.prototipo.controller;

import com.exoal.prototipo.entity.Sede;
import com.exoal.prototipo.repository.SedeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SedeControllerTest {

    @Mock
    private SedeRepository sedeRepository;

    @InjectMocks
    private SedeController sedeController;

    private Sede sede1;
    private Sede sede2;

    @BeforeEach
    void setUp() {
        sede1 = new Sede("Plantel Centro", "plantel", "Av. Universidad 123", "555-0101", "centro@univ.edu");
        sede1.setIdSede(1L);
        sede2 = new Sede("Unidad Norte", "unidad", "Calle Norte 456", "555-0202", "norte@univ.edu");
        sede2.setIdSede(2L);
    }

    @Test
    void getAllSedes_retornaListaCompleta() {
        when(sedeRepository.findAll()).thenReturn(Arrays.asList(sede1, sede2));

        List<Sede> result = sedeController.getAllSedes();

        assertEquals(2, result.size());
        assertEquals("Plantel Centro", result.get(0).getNombre());
        verify(sedeRepository, times(1)).findAll();
    }

    @Test
    void getSedeById_existente_retornaSede() {
        when(sedeRepository.findById(1L)).thenReturn(Optional.of(sede1));

        Sede result = sedeController.getSedeById(1L);

        assertNotNull(result);
        assertEquals("plantel", result.getTipo());
    }

    @Test
    void getSedeById_noExistente_retornaNull() {
        when(sedeRepository.findById(99L)).thenReturn(Optional.empty());

        Sede result = sedeController.getSedeById(99L);

        assertNull(result);
    }

    @Test
    void createSede_guardaYRetornaSede() {
        when(sedeRepository.save(any(Sede.class))).thenReturn(sede1);

        Sede result = sedeController.createSede(sede1);

        assertNotNull(result);
        assertEquals("Plantel Centro", result.getNombre());
        verify(sedeRepository, times(1)).save(sede1);
    }

    @Test
    void updateSede_existente_actualizaCampos() {
        Sede detalles = new Sede("Plantel Centro Actualizado", "plantel", "Nueva Dir", "555-9999", "nuevo@univ.edu");
        when(sedeRepository.findById(1L)).thenReturn(Optional.of(sede1));
        when(sedeRepository.save(any(Sede.class))).thenReturn(sede1);

        Sede result = sedeController.updateSede(1L, detalles);

        assertNotNull(result);
        verify(sedeRepository, times(1)).save(sede1);
    }

    @Test
    void updateSede_noExistente_retornaNull() {
        when(sedeRepository.findById(99L)).thenReturn(Optional.empty());

        Sede result = sedeController.updateSede(99L, sede1);

        assertNull(result);
        verify(sedeRepository, never()).save(any());
    }

    @Test
    void deleteSede_llamaDeleteById() {
        doNothing().when(sedeRepository).deleteById(1L);

        sedeController.deleteSede(1L);

        verify(sedeRepository, times(1)).deleteById(1L);
    }
}
