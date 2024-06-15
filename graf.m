function graf = graf(X,Y,dX, n)
vektor = zeros(1,n);
p0 = Y/X;
for i = 1:n
    [vpliv,X,Y,p1] = impact(X,Y,dX);
    %vektor(i) = vpliv;
    vektor(i) = p1;
end

plot(0:n,[p0,vektor])

    
