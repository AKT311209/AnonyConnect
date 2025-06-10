import Turnstile from 'react-turnstile';

const TurnstileWidget = ({ sitekey = "0x4AAAAAAA-RcQdPu6mWgu-p", ...props }) => (
    <Turnstile sitekey={sitekey} {...props} />
);

export default TurnstileWidget;
