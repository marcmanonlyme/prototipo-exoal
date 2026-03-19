package com.exoal.prototipo.config;

import com.exoal.prototipo.entity.Sede;
import com.exoal.prototipo.entity.Usuario;
import com.exoal.prototipo.repository.SedeRepository;
import com.exoal.prototipo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private SedeRepository sedeRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.findByEmail("admin@demo.edu").isEmpty()) {
            Sede sede = sedeRepository.findAll().stream().findFirst()
                    .orElseGet(() -> sedeRepository.save(
                            new Sede("Sede Demo", "plantel", "Av. Universitaria 1", "555-0000", "demo@exoal.edu")));

            Usuario admin = new Usuario("Admin Demo", "admin@demo.edu",
                    passwordEncoder.encode("Admin1234"), "administrador", sede);
            admin.setEstado("activo");
            admin.setIdInstitucional("EMP-ADMIN001");
            usuarioRepository.save(admin);

            Usuario docente = new Usuario("Docente Demo", "docente@demo.edu",
                    passwordEncoder.encode("Docente123"), "docente", sede);
            docente.setEstado("activo");
            docente.setIdInstitucional("EMP-DOC001");
            usuarioRepository.save(docente);

            Usuario estudiante = new Usuario("Estudiante Demo", "estudiante@demo.edu",
                    passwordEncoder.encode("Estudiante123"), "estudiante", sede);
            estudiante.setEstado("activo");
            estudiante.setIdInstitucional("MAT-EST001");
            usuarioRepository.save(estudiante);
        }
    }
}
