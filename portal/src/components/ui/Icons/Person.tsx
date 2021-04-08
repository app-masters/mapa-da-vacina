import * as React from 'react';

/**
 * SvgPerson
 */
function SvgPerson(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={12.52} height={22.316} viewBox="0 0 8.52 20.316" {...props}>
      <g data-name="Grupo 14" fill="currentColor">
        <path
          data-name="Caminho 6"
          d="M5.57 7.209H2.949A2.953 2.953 0 000 10.158v4.26a.327.327 0 00.263.321l1.391.278.312 4.991a.328.328 0 00.327.307h3.932a.328.328 0 00.327-.307l.312-4.991 1.391-.278a.328.328 0 00.263-.321v-4.26A2.953 2.953 0 005.57 7.209z"
        />
        <path data-name="Caminho 7" d="M4.26 5.9a2.949 2.949 0 10-2.949-2.951A2.953 2.953 0 004.26 5.9z" />
      </g>
    </svg>
  );
}

export default SvgPerson;
