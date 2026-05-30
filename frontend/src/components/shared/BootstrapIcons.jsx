const IconBase = ({ size = 24, className = '', children, title, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
    aria-hidden={title ? undefined : 'true'}
    role={title ? 'img' : undefined}
    {...props}
  >
    {title && <title>{title}</title>}
    {children}
  </svg>
);

export const Search = (props) => (
  <IconBase {...props}>
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85-.017.016zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
  </IconBase>
);

export const X = (props) => (
  <IconBase {...props}>
    <path d="M2.146 2.146a.5.5 0 0 1 .708 0L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854a.5.5 0 0 1 0-.708z" />
  </IconBase>
);

export const Menu = (props) => (
  <IconBase {...props}>
    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
  </IconBase>
);

export const Car = (props) => (
  <IconBase {...props}>
    <path d="M4 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
    <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.36a2.5 2.5 0 0 1 2.3 1.515L14.64 6.2A2 2 0 0 1 16 8.09V11.5a.5.5 0 0 1-.5.5H14v1.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V12H4v1.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V12H.5a.5.5 0 0 1-.5-.5V8.09A2 2 0 0 1 1.36 6.2l1.16-2.685zM4.82 3a1.5 1.5 0 0 0-1.38.91L2.54 6h10.92l-.9-2.09A1.5 1.5 0 0 0 11.18 3H4.82z" />
  </IconBase>
);

export const CarFront = Car;
export const Truck = Car;

export const User = (props) => (
  <IconBase {...props}>
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M14 14s-1-4-6-4-6 4-6 4 1 1 6 1 6-1 6-1z" />
  </IconBase>
);

export const UserCircle = (props) => (
  <IconBase {...props}>
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.47 11.37C3.48 10.9 5.12 10 8 10s4.52.9 5.47 2.37A7 7 0 0 0 8 1z" />
  </IconBase>
);

export const Users = (props) => (
  <IconBase {...props}>
    <path d="M7 14s-1-4-5-4-2 4-2 4 1 1 3.5 1S7 14 7 14zm7.5 1c2.5 0 3.5-1 3.5-1s0-4-2-4c-1.3 0-2.2.42-2.84 1.01.74.84 1.05 1.87 1.05 2.99 0 .37-.06.7-.17 1H14.5z" />
    <path d="M4 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
  </IconBase>
);

export const Mail = (props) => (
  <IconBase {...props}>
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-.5a.5.5 0 0 0-.5.5v.22l6.5 3.9 6.5-3.9V4a.5.5 0 0 0-.5-.5H2zm12.5 2.47-4.74 2.84 4.74 2.92V5.97zm-.7 6.53L8 8.93 2.2 12.5h11.6zM1.5 11.73l4.74-2.92L1.5 5.97v5.76z" />
  </IconBase>
);

export const Lock = (props) => (
  <IconBase {...props}>
    <path d="M8 1a3 3 0 0 0-3 3v2H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1V4a3 3 0 0 0-3-3zM6 6V4a2 2 0 1 1 4 0v2H6z" />
  </IconBase>
);

export const Phone = (props) => (
  <IconBase {...props}>
    <path d="M3.65 1.33a1.68 1.68 0 0 1 2.45.22l1.03 1.37a1.68 1.68 0 0 1-.2 2.25l-.7.7a11.2 11.2 0 0 0 3.9 3.9l.7-.7a1.68 1.68 0 0 1 2.25-.2l1.37 1.03a1.68 1.68 0 0 1 .22 2.45l-.62.72c-.73.84-1.9 1.2-2.98.93C5.96 12.73 3.27 10.04 2 4.93c-.27-1.08.09-2.25.93-2.98l.72-.62z" />
  </IconBase>
);

export const Eye = (props) => (
  <IconBase {...props}>
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </IconBase>
);

export const EyeOff = (props) => (
  <IconBase {...props}>
    <path d="M13.36 11.24C14.93 9.92 16 8 16 8s-3-5.5-8-5.5a7.2 7.2 0 0 0-2.79.57l1.18 1.18A3 3 0 0 1 11.75 9.6l1.61 1.64zM2.65 1.35a.5.5 0 1 0-.7.7l12 12a.5.5 0 0 0 .7-.7l-12-12zM.87 8S3.87 13.5 8 13.5c1.04 0 1.99-.24 2.84-.62L9.45 11.5A3 3 0 0 1 4.5 6.55L2.86 4.91C1.65 6.1.87 8 .87 8z" />
  </IconBase>
);

export const MapPin = (props) => (
  <IconBase {...props}>
    <path d="M8 16s6-5.69 6-10A6 6 0 0 0 2 6c0 4.31 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
  </IconBase>
);

export const Calendar = (props) => (
  <IconBase {...props}>
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5H1z" />
  </IconBase>
);

export const CalendarCheck = (props) => (
  <IconBase {...props}>
    <path d="M10.85 8.15a.5.5 0 0 1 0 .7l-3 3a.5.5 0 0 1-.7 0l-1.5-1.5a.5.5 0 1 1 .7-.7L7.5 10.79l2.65-2.64a.5.5 0 0 1 .7 0z" />
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5H1z" />
  </IconBase>
);

export const Clock = (props) => (
  <IconBase {...props}>
    <path d="M8 3.5a.5.5 0 0 1 .5.5v4l2.5 1.5a.5.5 0 0 1-.5.86l-2.75-1.65A.5.5 0 0 1 7.5 8V4a.5.5 0 0 1 .5-.5z" />
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14z" />
  </IconBase>
);

export const Star = (props) => (
  <IconBase {...props}>
    <path d="M3.61 15.44c-.58.3-1.25-.2-1.14-.85l.83-4.73L-.24 6.51c-.47-.46-.21-1.26.43-1.35l4.75-.69L7.06.17a.75.75 0 0 1 1.35 0l2.12 4.3 4.75.69c.65.09.9.9.44 1.35l-3.44 3.35.81 4.73c.12.65-.56 1.15-1.14.85L7.78 13.2l-4.17 2.24z" />
  </IconBase>
);

export const CheckCircle = (props) => (
  <IconBase {...props}>
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03l5-5a.75.75 0 0 0-1.06-1.06L6.5 9.38 5.09 7.97a.75.75 0 0 0-1.06 1.06l1.94 2a.75.75 0 0 0 1 0z" />
  </IconBase>
);

export const CheckCircle2 = CheckCircle;

export const XCircle = (props) => (
  <IconBase {...props}>
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.35 4.65a.5.5 0 1 0-.7.7L7.29 8l-2.64 2.65a.5.5 0 0 0 .7.7L8 8.71l2.65 2.64a.5.5 0 0 0 .7-.7L8.71 8l2.64-2.65a.5.5 0 0 0-.7-.7L8 7.29 5.35 4.65z" />
  </IconBase>
);

export const AlertCircle = (props) => (
  <IconBase {...props}>
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 4h2v5H7V4zm0 7h2v2H7v-2z" />
  </IconBase>
);

export const Info = (props) => (
  <IconBase {...props}>
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 7h2v5H7V7zm0-3h2v2H7V4z" />
  </IconBase>
);

export const ArrowRight = (props) => (
  <IconBase {...props}>
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.79L9.15 3.35a.5.5 0 1 1 .7-.7l5 5a.5.5 0 0 1 0 .7l-5 5a.5.5 0 0 1-.7-.7l4.14-4.15H1.5A.5.5 0 0 1 1 8z" />
  </IconBase>
);

export const ArrowLeft = (props) => (
  <IconBase {...props}>
    <path fillRule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.71l4.14 4.15a.5.5 0 0 1-.7.7l-5-5a.5.5 0 0 1 0-.7l5-5a.5.5 0 1 1 .7.7L2.71 7.5H14.5A.5.5 0 0 1 15 8z" />
  </IconBase>
);

export const ChevronLeft = (props) => (
  <IconBase {...props}>
    <path fillRule="evenodd" d="M11.35 1.65a.5.5 0 0 1 0 .7L5.71 8l5.64 5.65a.5.5 0 0 1-.7.7l-6-6a.5.5 0 0 1 0-.7l6-6a.5.5 0 0 1 .7 0z" />
  </IconBase>
);

export const ChevronRight = (props) => (
  <IconBase {...props}>
    <path fillRule="evenodd" d="M4.65 1.65a.5.5 0 0 0 0 .7L10.29 8l-5.64 5.65a.5.5 0 0 0 .7.7l6-6a.5.5 0 0 0 0-.7l-6-6a.5.5 0 0 0-.7 0z" />
  </IconBase>
);

export const ExternalLink = (props) => (
  <IconBase {...props}>
    <path fillRule="evenodd" d="M6.5 3a.5.5 0 0 1 0 1H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.5a.5.5 0 0 1 1 0V13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.5z" />
    <path fillRule="evenodd" d="M11.5 1h4v4a.5.5 0 0 1-1 0V2.71L7.85 9.35a.5.5 0 1 1-.7-.7L13.79 2H11.5a.5.5 0 0 1 0-1z" />
  </IconBase>
);

export const Plus = (props) => (
  <IconBase {...props}>
    <path d="M8 1.5a.5.5 0 0 1 .5.5v5.5H14a.5.5 0 0 1 0 1H8.5V14a.5.5 0 0 1-1 0V8.5H2a.5.5 0 0 1 0-1h5.5V2a.5.5 0 0 1 .5-.5z" />
  </IconBase>
);

export const Edit2 = (props) => (
  <IconBase {...props}>
    <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-9.5 9.5L2 14l.646-3.646 9.5-9.5z" />
  </IconBase>
);

export const Edit3 = Edit2;

export const Trash2 = (props) => (
  <IconBase {...props}>
    <path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2H5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h2.5a1 1 0 0 1 1 1zM4 4v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4H4z" />
  </IconBase>
);

export const Save = (props) => (
  <IconBase {...props}>
    <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4.5L12.5 1H2zm9 1v4H4V2h7zm-7 12v-4h8v4H4z" />
  </IconBase>
);

export const LogOut = (props) => (
  <IconBase {...props}>
    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-6A1.5 1.5 0 0 1 2 11.5v-7A1.5 1.5 0 0 1 3.5 3h6a.5.5 0 0 1 0 1h-6A.5.5 0 0 0 3 4.5v7a.5.5 0 0 0 .5.5h6a.5.5 0 0 1 .5.5z" />
    <path fillRule="evenodd" d="M11.854 11.354a.5.5 0 0 1-.708-.708L13.793 8l-2.647-2.646a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5z" />
    <path fillRule="evenodd" d="M5 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 8z" />
  </IconBase>
);

export const CreditCard = (props) => (
  <IconBase {...props}>
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 3h2a.5.5 0 0 1 0 1H3a.5.5 0 0 1 0-1z" />
  </IconBase>
);

export const DollarSign = (props) => (
  <IconBase {...props}>
    <path d="M4 10.78c0 1.08.84 1.9 2.25 2.16V15h1.5v-2.02C9.23 12.78 10 11.93 10 10.84c0-1.2-.76-1.93-2.43-2.48l-.64-.2C6.02 7.86 5.7 7.56 5.7 7.05c0-.58.52-.96 1.34-.96.73 0 1.2.28 1.64.84l1.08-.9c-.47-.73-1.16-1.13-2.01-1.25V3H6.25v1.82C4.9 5.08 4.15 5.92 4.15 7.07c0 1.1.74 1.84 2.24 2.3l.7.22c.96.3 1.22.63 1.22 1.18 0 .61-.54 1-1.48 1-.86 0-1.5-.33-1.9-.98H4z" />
  </IconBase>
);

export const BarChart2 = (props) => (
  <IconBase {...props}>
    <path d="M1 13.5a.5.5 0 0 1 .5-.5H15a.5.5 0 0 1 0 1H1.5a.5.5 0 0 1-.5-.5zM3 11h2V5H3v6zm4 0h2V2H7v9zm4 0h2V7h-2v4z" />
  </IconBase>
);

export const LayoutDashboard = (props) => (
  <IconBase {...props}>
    <path d="M0 2a2 2 0 0 1 2-2h4v7H0V2zm0 7h6v7H2a2 2 0 0 1-2-2V9zm8 7h6a2 2 0 0 0 2-2V9H8v7zm8-9H8V0h6a2 2 0 0 1 2 2v5z" />
  </IconBase>
);

export const TrendingUp = (props) => (
  <IconBase {...props}>
    <path fillRule="evenodd" d="M0 12.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zM10.5 3a.5.5 0 0 1 .5-.5h4v4a.5.5 0 0 1-1 0V4.2L9.35 8.85a.5.5 0 0 1-.7 0L6.5 6.71 2.35 10.85a.5.5 0 1 1-.7-.7l4.5-4.5a.5.5 0 0 1 .7 0L9 7.79 13.29 3.5H11a.5.5 0 0 1-.5-.5z" />
  </IconBase>
);

export const RefreshCw = (props) => (
  <IconBase {...props}>
    <path d="M8 3a5 5 0 0 0-4.55 2.92.5.5 0 1 1-.9-.43A6 6 0 0 1 13 4.1V2.5a.5.5 0 0 1 1 0v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h1.83A4.98 4.98 0 0 0 8 3zm5.45 7.08a.5.5 0 1 1 .9.43A6 6 0 0 1 3 11.9v1.6a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 2.5 10h3a.5.5 0 0 1 0 1H3.67A4.98 4.98 0 0 0 8 13a5 5 0 0 0 5.45-2.92z" />
  </IconBase>
);

export const Flag = (props) => (
  <IconBase {...props}>
    <path d="M14.78 3.02A.5.5 0 0 1 15 3.5v7a.5.5 0 0 1-.76.43L10 8.39l-4.24 2.54A.5.5 0 0 1 5 10.5v-7a.5.5 0 0 1 .76-.43L10 5.61l4.24-2.54a.5.5 0 0 1 .54-.05zM4 2.5a.5.5 0 0 0-1 0V15a.5.5 0 0 0 1 0V2.5z" />
  </IconBase>
);

export const Fuel = (props) => (
  <IconBase {...props}>
    <path d="M3 2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v11h.5a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1H3V2zm2-1a1 1 0 0 0-1 1v4h6V2a1 1 0 0 0-1-1H5zm7.5 1.5 2 2V11a1 1 0 0 1-2 0V8.5a1.5 1.5 0 0 0-1.5-1.5V6a2.5 2.5 0 0 1 2.5 2.5V11h.5V4.91l-1.85-1.85.35-.56z" />
  </IconBase>
);

export const Settings = (props) => (
  <IconBase {...props}>
    <path d="M9.4 1.05a1 1 0 0 0-2.8 0l-.22.76a6.5 6.5 0 0 0-1.2.5l-.7-.38a1 1 0 0 0-1.4 1.4l.38.7a6.5 6.5 0 0 0-.5 1.2l-.76.22a1 1 0 0 0 0 2.8l.76.22c.13.42.3.82.5 1.2l-.38.7a1 1 0 0 0 1.4 1.4l.7-.38c.38.2.78.37 1.2.5l.22.76a1 1 0 0 0 2.8 0l.22-.76c.42-.13.82-.3 1.2-.5l.7.38a1 1 0 0 0 1.4-1.4l-.38-.7c.2-.38.37-.78.5-1.2l.76-.22a1 1 0 0 0 0-2.8l-.76-.22a6.5 6.5 0 0 0-.5-1.2l.38-.7a1 1 0 0 0-1.4-1.4l-.7.38a6.5 6.5 0 0 0-1.2-.5l-.22-.76zM8 10.5A2.5 2.5 0 1 1 8 5a2.5 2.5 0 0 1 0 5.5z" />
  </IconBase>
);

export const SlidersHorizontal = (props) => (
  <IconBase {...props}>
    <path d="M11.5 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM1 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 1 4zm13.5-.5h-1a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zM4.5 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM1 12a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1A.5.5 0 0 1 1 12zm6.5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z" />
  </IconBase>
);

export const UploadCloud = (props) => (
  <IconBase {...props}>
    <path d="M8 2a5.5 5.5 0 0 0-5.47 5A4 4 0 0 0 4 15h8a4 4 0 0 0 .57-7.96A5.5 5.5 0 0 0 8 2zm.5 9.5a.5.5 0 0 1-1 0V6.71L5.35 8.85a.5.5 0 1 1-.7-.7l3-3a.5.5 0 0 1 .7 0l3 3a.5.5 0 0 1-.7.7L8.5 6.71V11.5z" />
  </IconBase>
);

export const MessageSquare = (props) => (
  <IconBase {...props}>
    <path d="M2 2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2.59l2.7 2.7a1 1 0 0 0 1.41 0l2.7-2.7H14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z" />
  </IconBase>
);

export const Send = (props) => (
  <IconBase {...props}>
    <path d="M15.85.15a.5.5 0 0 1 .11.54l-5.5 14a.5.5 0 0 1-.93.02L6.9 8.1.29 5.47a.5.5 0 0 1 .02-.93l14-5.5a.5.5 0 0 1 .54.11z" />
  </IconBase>
);

export const Shield = (props) => (
  <IconBase {...props}>
    <path d="M5.07.36a1 1 0 0 1 .86 0l4.5 2A1 1 0 0 1 11 3.27v3.48c0 2.84-1.55 5.45-4 6.81-2.45-1.36-4-3.97-4-6.81V3.27a1 1 0 0 1 .57-.91l4.5-2z" />
  </IconBase>
);

export const ShieldCheck = (props) => (
  <IconBase {...props}>
    <path d="M5.07.36a1 1 0 0 1 .86 0l4.5 2A1 1 0 0 1 11 3.27v3.48c0 2.84-1.55 5.45-4 6.81-2.45-1.36-4-3.97-4-6.81V3.27a1 1 0 0 1 .57-.91l4.5-2zM9.85 5.35a.5.5 0 0 0-.7-.7L6.5 7.29 5.35 6.15a.5.5 0 1 0-.7.7l1.5 1.5a.5.5 0 0 0 .7 0l3-3z" />
  </IconBase>
);

export const Gauge = (props) => (
  <IconBase {...props}>
    <path d="M8 4a8 8 0 0 0-7.47 10.87.5.5 0 0 0 .47.33h14a.5.5 0 0 0 .47-.33A8 8 0 0 0 8 4zm3.35 3.65a.5.5 0 0 1 0 .7l-2.8 2.8A1.5 1.5 0 1 1 7.85 10l2.8-2.8a.5.5 0 0 1 .7 0z" />
  </IconBase>
);

export const Headphones = (props) => (
  <IconBase {...props}>
    <path d="M8 1a7 7 0 0 0-7 7v3a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H3a5 5 0 0 1 10 0h-1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2V8a7 7 0 0 0-7-7z" />
  </IconBase>
);

export const Route = (props) => (
  <IconBase {...props}>
    <path d="M4 2a3 3 0 0 0-1 5.83v.34A3 3 0 1 0 5 11V7.83A3 3 0 0 0 4 2zm8 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm8 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  </IconBase>
);

export const Sparkles = (props) => (
  <IconBase {...props}>
    <path d="M8 0l1.4 4.6L14 6l-4.6 1.4L8 12 6.6 7.4 2 6l4.6-1.4L8 0zm-5 9 1 2.5L6.5 12 4 13l-1 2.5L2 13l-2.5-1L2 11.5 3 9zm10 1 1 2 2 .5-2 .5-1 2-1-2-2-.5 2-.5 1-2z" />
  </IconBase>
);

export const Loader2 = (props) => (
  <IconBase {...props}>
    <path d="M8 1a7 7 0 1 0 6.32 4H12.9A5.5 5.5 0 1 1 8 2.5V1z" />
  </IconBase>
);
