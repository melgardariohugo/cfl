document.addEventListener('DOMContentLoaded', () => {
  // Fecha del sistema (hoy) en input type="date"
  const fFecha = document.getElementById('f-fecha');
  const setHoy = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    fFecha.value = `${yyyy}-${mm}-${dd}`;
  };
  if (fFecha) {
    setHoy();
  }

  // Exclusividad: Alumno / Alumna (checkboxes)
  const chkAlumno = document.getElementById('chk-alumno');
  const chkAlumna = document.getElementById('chk-alumna');
  const exclusividad = (a, b) => {
    if (!a || !b) return;
    a.addEventListener('change', () => { if (a.checked) b.checked = false; });
    b.addEventListener('change', () => { if (b.checked) a.checked = false; });
  };
  exclusividad(chkAlumno, chkAlumna);

  // Botones Guardar / Limpiar
  const form = document.querySelector('.insc-card');
  const btnLimpiar = document.getElementById('btn-limpiar-form');

  // Guardar (por ahora: validar nativo y mostrar un aviso simple)
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Acá iría tu lógica real de envío (fetch/XHR)
    alert('✅ Datos validados y listos para enviar.');
  });

  // Limpiar
  btnLimpiar?.addEventListener('click', () => {
    form?.reset();
    setHoy();                // reponer la fecha actual
    chkAlumno?.dispatchEvent(new Event('change'));
    chkAlumna?.dispatchEvent(new Event('change'));
  });
});
