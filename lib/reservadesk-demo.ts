export type Zone = "Oro" | "Plata" | "Bronce";
export type Student = { id: string; family: string; name: string; email: string; level: number; functionNo: number; parents: string[] };
const familySizes = [4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2];
const parents = ["Mariana y Carlos Torres","Daniela y Sergio Ríos","Andrea y Luis Vega","Paola y Jorge Méndez","Laura e Iván Castillo","Elena y Manuel Cruz","Patricia y Héctor Luna","Sofía y Marco Ramos","Karla y Diego Flores","Cecilia y Raúl Ortiz"];
export const students: Student[] = familySizes.flatMap((size, familyIndex) => Array.from({ length: size }, (_, childIndex) => {
  const number = familyIndex + 1; const level = ((number + childIndex - 1) % 4) + 1;
  return { id: `student-${number}-${childIndex + 1}`, family: `FAM-${String(number).padStart(3,"0")}`, name: `Alumno ${String(number).padStart(3,"0")}-${childIndex + 1}`, email: `fam${String(number).padStart(3,"0")}-${childIndex + 1}@reservadesk.demo`, level, functionNo: level <= 2 ? 1 : level === 3 ? 2 : 3, parents: (parents[familyIndex % parents.length] || "Tutora y Tutor").split(" y ") };
}));
export const zones: { name: Zone; price: number; range: [number, number] }[] = [{ name:"Oro",price:180,range:[1,60] },{ name:"Plata",price:140,range:[61,120] },{ name:"Bronce",price:100,range:[121,180] }];
export const limits = { 1: 8, 2: 6, 3: 4 } as const;
export const seatZone = (number: number) => zones.find((zone) => number >= zone.range[0] && number <= zone.range[1])!;
