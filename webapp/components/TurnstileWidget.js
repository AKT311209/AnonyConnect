import Turnstile from 'react-turnstile';

const TurnstileWidget = ({ sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, ...props }) => (
    <Turnstile sitekey={sitekey} {...props} />
);

export default TurnstileWidget;
