
type Props = {
    result: number
}

const Result = ({result}: Props) => {
    return (
        <div style={{paddingLeft: "6px",fontSize: "xx-large"}} className="Result">
            = {result} <br />
        </div>
    );
}

export default Result;