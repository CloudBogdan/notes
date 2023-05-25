const Cursor: React.FC<{ number?: number }> = ({ number })=> {
    return (
        <svg className={ "cursor" + (number ? ` num-${ number }` : "") } width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.86124 3.1445C1.53483 2.33174 2.3369 1.52181 3.1528 1.84027L25.4637 10.5486C27.1289 11.1985 27.1701 13.54 25.5287 14.2481L18.2665 17.381C17.8186 17.5742 17.4568 17.9245 17.2491 18.3658L14.1996 24.8461C13.4558 26.4269 11.1851 26.3611 10.534 24.7399L1.86124 3.1445Z" fill="#121212" stroke="white" strokeWidth="3"/>
        </svg>
    );
};

export default Cursor;