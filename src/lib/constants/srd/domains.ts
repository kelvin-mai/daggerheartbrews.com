const domainColors = {
  arcana: '#4e3456',
  blade: '#af231c',
  blood: '#7a0e0e',
  bone: '#a4a9a8',
  codex: '#24395d',
  grace: '#8d3965',
  midnight: '#1e201f',
  sage: '#244e30',
  splendor: '#b8a342',
  valor: '#e2680e',
};

export const domainColor = (domain?: string) => {
  return domain ? domainColors[domain as keyof typeof domainColors] : '#fff';
};
