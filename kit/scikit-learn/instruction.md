# scikit-learn

scikit-learn is the standard Python library for machine learning. It provides
classification, regression, clustering, dimensionality reduction, model
selection, and preprocessing. **Important**: the Python import name is `sklearn`,
not `scikit-learn` or `scikit_learn` — always use `from sklearn… import …` or
`import sklearn`. scikit-learn depends on SciPy and joblib (shared kits) and
bundles threadpoolctl for thread management.

## When to Use

- Training supervised models — classification (logistic regression, SVM, random
  forest, gradient boosting) and regression (linear, ridge, SVR, decision tree)
- Unsupervised learning — clustering (KMeans, DBSCAN, agglomerative),
  dimensionality reduction (PCA, t-SNE, UMAP via PCA pre-step)
- Evaluating models with cross-validation, train/test splits, and scoring
  metrics (accuracy, F1, R2, RMSE, confusion matrix)
- Preprocessing — feature scaling (`StandardScaler`, `MinMaxScaler`), encoding
  (`OneHotEncoder`, `LabelEncoder`), imputation (`SimpleImputer`)
- Building end-to-end pipelines (`Pipeline`, `make_pipeline`,
  `ColumnTransformer`) that chain transforms and estimators
- Hyperparameter tuning (`GridSearchCV`, `RandomizedSearchCV`)

## When NOT to Use

- Raw array math or linear algebra (use **numpy**)
- Statistical distributions, hypothesis tests, or nonlinear optimisation (use
  **scipy** — sklearn's optimisers are model-internal)
- Data loading, cleaning, or tabular manipulation (use **pandas** — prepare your
  DataFrame first, then pass arrays to sklearn)
- Bayesian posterior sampling / MCMC parameter estimation (use **emcee**)
- Symbolic algebra or calculus (use **sympy**)
- Graph or network analysis (use **networkx**)

## Capabilities

| Area | Key API |
|---|---|
| Classification | `LogisticRegression`, `SVC`, `RandomForestClassifier`, `GradientBoostingClassifier` |
| Regression | `LinearRegression`, `Ridge`, `Lasso`, `SVR`, `DecisionTreeRegressor` |
| Clustering | `KMeans`, `DBSCAN`, `AgglomerativeClustering`, `SpectralClustering` |
| Dimensionality | `PCA`, `TruncatedSVD`, `TSNE`, `KernelPCA` |
| Preprocessing | `StandardScaler`, `MinMaxScaler`, `OneHotEncoder`, `SimpleImputer` |
| Model selection | `cross_val_score`, `GridSearchCV`, `train_test_split`, `StratifiedKFold` |
| Metrics | `accuracy_score`, `r2_score`, `mean_squared_error`, `confusion_matrix`, `f1_score` |
| Pipelines | `Pipeline`, `make_pipeline`, `ColumnTransformer`, `FeatureUnion` |

## Worked Example

Fit a linear regression and extract the slope:

```python
from sklearn.linear_model import LinearRegression as L

model = L()
model.fit([[0], [1], [2]], [0, 1, 2])
slope = round(float(model.coef_[0]), 1)
str(slope)
# → "1.0"
```

`LinearRegression.fit(X, y)` takes a 2-D feature matrix and a target vector.
After fitting, `coef_` holds the learned weights and `intercept_` the bias. For
classification, replace with `LogisticRegression` and call `predict_proba` for
class probabilities.
