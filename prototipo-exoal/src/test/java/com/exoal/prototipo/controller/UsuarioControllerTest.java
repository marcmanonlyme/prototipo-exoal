package com.exoal.prototipo.controller;

import com.exoal.prototipo.entity.Sede;
import com.exoal.prototipo.entity.Usuario;
import com.exoal.prototipo.repository.UsuarioRepository;
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
class UsuarioControllerTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioController usuarioController;

    private Sede sede;
    private Usuario usuario1;
    private Usuario usuario2;

    @BeforeEach
    void setUp() {
        sede = new Sede("Plantel Centro", "plantel", "Av. Universidad 123", "555-0101", "centro@univ.edu");
        sede.setIdSede(1L);

        usuario1 = new Usuario("Admin Principal", "admin@univ.edu", "hash123", "administrador", sede);
        usuario1.setIdUsuario(1L);

        usuario2 = new Usuario("Docente María", "maria@univ.edu", "hash456", "docente", sede);
        usuario2.setIdUsuario(2L);
    }

    @Test
    void getAllUsuarios_retornaListaCompleta() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario1, usuario2));

        List<Usuario> result = usuarioController.getAllUsuarios();

        assertEquals(2, result.size());
        assertEquals("Admin Principal", result.get(0).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void getUsuarioById_existente_retornaUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));

        Usuario result = usuarioController.getUsuarioById(1L);

        assertNotNull(result);
        assertEquals("admin@univ.edu", result.getEmail());
    }

    @Test
    void getUsuarioById_noExistente_retornaNull() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        Usuario result = usuarioController.getUsuarioById(99L);

        assertNull(result);
    }

    @Test
    void createUsuario_guardaYRetornaUsuario() {
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario1);

        Usuario result = usuarioController.createUsuario(usuario1);

        assertNotNull(result);
        assertEquals("administrador", result.getTipoUsuario());
        verify(usuarioRepository, times(1)).save(usuario1);
    }

    @Test
    void updateUsuario_conPasswordNuevo_actualizaPassword() {
        Usuario detalles = new Usuario("Admin Actualizado", "admin@univ.edu", "nuevaPassword", "administrador", sede);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario1);

        Usuario result = usuarioController.updateUsuario(1L, detalles);

        assertNotNull(result);
        // La password debe haberse actualizado porque no está vacía
        verify(usuarioRepository, times(1)).save(usuario1);
        assertEquals("nuevaPassword", usuario1.getPassword());
    }

    @Test
    void updateUsuario_conPasswordVacia_noActualizaPassword() {
        usuario1.setPassword("passwordOriginal");
        Usuario detalles = new Usuario("Admin Actualizado", "admin@univ.edu", "", "administrador", sede);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario1);

        usuarioController.updateUsuario(1L, detalles);

        // La password original no debe cambiar cuando se envía vacía
        assertEquals("passwordOriginal", usuario1.getPassword());
    }

    @Test
    void updateUsuario_noExistente_retornaNull() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        Usuario result = usuarioController.updateUsuario(99L, usuario1);

        assertNull(result);
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void deleteUsuario_llamaDeleteById() {
        doNothing().when(usuarioRepository).deleteById(1L);

        usuarioController.deleteUsuario(1L);

        verify(usuarioRepository, times(1)).deleteById(1L);
    }
}
