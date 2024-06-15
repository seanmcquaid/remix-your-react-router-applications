import { useNavigate } from '@remix-run/react';
import { Button } from '@/components/ui/Button';

interface PageErrorProps {
  titleText?: string;
  errorText?: string;
}

const PageError = ({ errorText, titleText }: PageErrorProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-full w-full p-8 flex-col">
      <h1>
        {titleText
          ? titleText
          : "We're sorry, there was a problem loading this page"}
      </h1>
      {!!errorText && <p>{errorText}</p>}
      <Button onClick={handleGoBack}>Go Back</Button>
    </div>
  );
};

export default PageError;
