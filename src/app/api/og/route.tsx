import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "black",
          background: "black",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="500" height="500" fill="#0D0D0D" />
          <path
            d="M119.504 296.438C117.82 296.881 114.587 294.845 113.244 293.918L91.1616 279.399C88.9039 277.915 86.4105 276.554 84.5382 274.58C82.1747 272.087 80.5714 268.985 79.8531 265.626C79.3734 263.382 79.5206 261.083 79.5234 258.801L79.5415 229.035C79.7775 228.805 80.0311 228.713 80.3048 228.538L108.363 210.197L119.535 203.189L119.682 203.167C120.493 203.549 121.197 204.079 121.938 204.58L158.657 228.53C158.923 228.703 159.206 228.847 159.456 229.044L159.467 258.947C159.467 260.623 159.571 262.371 159.411 264.038C159.044 267.866 157.186 271.696 154.609 274.494C153.231 275.99 151.568 276.975 149.874 278.052L126.452 293.417C123.803 295.199 122.776 296.307 119.504 296.438ZM125.321 220.563L125.32 250.656L139.179 241.52L148.344 235.628C147.072 235.048 145.901 234.111 144.755 233.314L125.321 220.563ZM113.624 220.659C112.981 220.97 112.37 221.377 111.774 221.759L92.6111 234.398C92.0014 234.82 91.3372 235.201 90.7541 235.655C91.9662 236.677 93.4872 237.447 94.8326 238.281L99.9424 241.617L112.124 249.663C112.54 249.958 113.365 250.37 113.627 250.626C113.653 247.635 113.689 220.753 113.624 220.659ZM148.236 250.613L136.077 258.55C130.71 262.091 127.348 265.519 125.791 272.192C125.18 274.807 125.364 277.521 125.368 280.188L125.394 280.216C126.009 279.912 126.504 279.539 127.016 279.191L141.895 269.47C146.84 266.339 148.264 264.861 148.266 258.467L148.271 251.758C148.277 251.397 148.336 250.96 148.271 250.606L148.236 250.613ZM90.7428 250.596L90.7374 259.458C90.7398 264.734 92.9344 266.883 97.024 269.477L112.021 279.233C112.548 279.571 113.094 279.889 113.6 280.259C113.643 278.617 113.729 276.923 113.617 275.287C113.286 270.45 111.398 265.78 107.957 262.319C106.118 260.469 103.815 259.177 101.666 257.727L90.7428 250.596Z"
            fill="#F9F9F9"
          />
          <path
            d="M188.78 227.837V264.285H218.02V271.833H179.736V227.837H188.78ZM240.391 272.581C237.037 272.581 233.977 271.856 231.211 270.405C228.491 268.909 226.315 266.847 224.683 264.217C223.097 261.543 222.303 258.46 222.303 254.969C222.303 251.388 223.119 248.283 224.751 245.653C226.383 243.024 228.582 240.984 231.347 239.533C234.158 238.037 237.331 237.289 240.867 237.289C244.766 237.289 247.894 238.083 250.251 239.669C252.654 241.211 254.399 243.319 255.487 245.993C256.575 248.668 257.119 251.66 257.119 254.969C257.119 256.964 256.802 259.004 256.167 261.089C255.533 263.129 254.558 265.033 253.243 266.801C251.929 268.524 250.206 269.929 248.075 271.017C245.945 272.06 243.383 272.581 240.391 272.581ZM243.247 265.781C245.922 265.781 248.234 265.328 250.183 264.421C252.133 263.515 253.629 262.245 254.671 260.613C255.714 258.981 256.235 257.1 256.235 254.969C256.235 252.657 255.691 250.708 254.603 249.121C253.561 247.489 252.065 246.265 250.115 245.449C248.211 244.588 245.922 244.157 243.247 244.157C239.485 244.157 236.561 245.155 234.475 247.149C232.39 249.099 231.347 251.705 231.347 254.969C231.347 257.145 231.846 259.049 232.843 260.681C233.841 262.268 235.223 263.515 236.991 264.421C238.805 265.328 240.89 265.781 243.247 265.781ZM256.235 238.037H265.075V271.833H256.847C256.847 271.833 256.779 271.403 256.643 270.541C256.553 269.635 256.462 268.501 256.371 267.141C256.281 265.781 256.235 264.444 256.235 263.129V238.037ZM270.696 238.037H296.944V244.905H270.696V238.037ZM279.4 228.789H288.24V271.833H279.4V228.789ZM332.9 260.613H341.468C341.105 262.925 340.13 264.988 338.544 266.801C337.002 268.615 334.894 270.043 332.22 271.085C329.545 272.128 326.281 272.649 322.428 272.649C318.121 272.649 314.313 271.969 311.004 270.609C307.694 269.204 305.11 267.187 303.252 264.557C301.393 261.928 300.464 258.755 300.464 255.037C300.464 251.32 301.37 248.147 303.184 245.517C304.997 242.843 307.513 240.803 310.732 239.397C313.996 237.992 317.804 237.289 322.156 237.289C326.598 237.289 330.293 237.992 333.24 239.397C336.186 240.803 338.362 242.933 339.768 245.789C341.218 248.6 341.83 252.204 341.604 256.601H309.372C309.598 258.324 310.233 259.888 311.276 261.293C312.364 262.699 313.814 263.809 315.628 264.625C317.486 265.441 319.685 265.849 322.224 265.849C325.034 265.849 327.369 265.373 329.228 264.421C331.132 263.424 332.356 262.155 332.9 260.613ZM321.748 244.021C318.484 244.021 315.832 244.747 313.792 246.197C311.752 247.603 310.437 249.348 309.848 251.433H332.832C332.605 249.167 331.517 247.376 329.568 246.061C327.664 244.701 325.057 244.021 321.748 244.021ZM348.182 238.037H357.022V271.833H348.182V238.037ZM372.73 237.289C374.815 237.289 376.742 237.561 378.51 238.105C380.278 238.649 381.819 239.488 383.134 240.621C384.448 241.755 385.468 243.205 386.194 244.973C386.919 246.696 387.282 248.759 387.282 251.161V271.833H378.442V252.725C378.442 249.869 377.739 247.784 376.334 246.469C374.974 245.109 372.73 244.429 369.602 244.429C367.244 244.429 365.114 244.883 363.21 245.789C361.306 246.696 359.764 247.852 358.586 249.257C357.407 250.617 356.727 252.045 356.546 253.541L356.478 250.073C356.704 248.487 357.226 246.945 358.042 245.449C358.858 243.953 359.946 242.593 361.306 241.369C362.711 240.1 364.366 239.103 366.27 238.377C368.174 237.652 370.327 237.289 372.73 237.289ZM392.95 238.037H419.198V244.905H392.95V238.037ZM401.654 228.789H410.494V271.833H401.654V228.789Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
