import curp from 'curp';

const checkEnrollInfo = (data) => {
  const farmerInfo = curp.getPersona();
  farmerInfo.nombre = data.firstName;
  farmerInfo.apellidoPaterno = data.lastName;
  farmerInfo.genero = data.gender === 'male' ? 'M' : 'H';
  farmerInfo.fechaNacimiento = data.dob;
  farmerInfo.estado = curp.ESTADO.ESTADO_DE_MEXICO;
  const farmerCurp = curp.generar(farmerInfo);
  return curp.validar(farmerCurp);
};
export default checkEnrollInfo;
