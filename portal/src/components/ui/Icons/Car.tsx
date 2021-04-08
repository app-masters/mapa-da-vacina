import * as React from 'react';

/**
 * SvgCar
 */
function SvgCar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={21.435} height={19.053} viewBox="0 0 21.435 19.053" {...props}>
      <g data-name="Grupo 20">
        <path
          data-name="Caminho 11"
          d="M18.958 1.2A1.791 1.791 0 0017.267 0h-13.1a1.791 1.791 0 00-1.691 1.2L0 8.336v9.526a1.194 1.194 0 001.191 1.191h1.191a1.19 1.19 0 001.191-1.191v-1.191h14.29v1.191a1.194 1.194 0 001.191 1.191h1.191a1.19 1.19 0 001.191-1.191V8.336zM4.168 13.1a1.786 1.786 0 111.786-1.786A1.784 1.784 0 014.168 13.1zm13.1 0a1.786 1.786 0 111.786-1.786 1.784 1.784 0 01-1.787 1.786zM2.382 7.145l1.786-5.359h13.1l1.786 5.359z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

export default SvgCar;
