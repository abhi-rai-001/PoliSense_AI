# Brutal Test Suite

This comprehensive test suite evaluates the RAG engine's performance across multiple dimensions:

## Key Metrics Measured

- **Accuracy**: Percentage of correct answers compared to expected results
- **Traceability**: Confidence scores for clause attribution
- **Confidence**: System's self-reported confidence in answers
- **Performance**: Processing time per query and document

## Test Cases

The test cases are defined in `test_cases.json` and include:
- Multiple document types (health, auto, life insurance)
- Various question types (numerical, yes/no, coverage details)
- Expected answers for validation

## Running the Tests

1. Start the RAG service:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

2. Execute the brutal tests:
```bash
python -m app.tests.brutal_test
```

3. View results in `test_results.json`

## Interpreting Results

- **Success Rate**: Should be >90% for production readiness
- **Traceability**: Should be >0.8 for reliable clause attribution
- **Confidence**: Should correlate with accuracy
- **Processing Time**: Should be <3 seconds per query

## Adding More Tests

Edit `test_cases.json` to add:
- New document URLs
- Additional questions
- Expected answers

The test suite will automatically incorporate new test cases.