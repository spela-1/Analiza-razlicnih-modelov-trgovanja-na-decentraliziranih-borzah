%% Price impact
X = 50;   % X = 5000;
Y = 5 * 10^4;    %Y = 5 * 10^6;
k = X*Y;
p0 = Y/X;

% k = (x + dx)(y + dy)
dX = 1;

dY = k/(X +dX) - Y % predznak od dY je -

%price impact
vpliv = (p0 + dY)/p0; 

% število žetonov
Y1 = Y + dY;
X1 = X + dX;
p1 = Y1/X1

% število žetonov ki jih dobi uporabnik s provizijo:
dY_p = dY * (1 - 0.003);
Y1_p = Y + dY* (1 - 0.003);

% slipage

% k = (x + dx)(y + dy)
dX1 = 1;

dY1 = k/(X1 +dX) - Y1 % predznak od dY je -

razlika = dY - dY1;
zdrs = p0 - p1


%% uniswap 3
Xr = 50 % 2000;   % X = 5000;                  % realne rezerve
Yr = 5 * 10^4 %1  ;    %Y = 5 * 10^6;        % realne rezerve
% virtualne rezerve  
% Xv = L/sqrt(Pb)
% Yv = L*sqrt(Pa)
% P0 =1000
Pa = 800;
Pb = 1200;


% Xr = 1;
% Yr = 2000;
% Pa = 1800;
% Pb = 2200;
% P0 = 2000


x = Xr;
y = Yr;

funkcija = @(L) (x + L/sqrt(Pb)) * (y + L*sqrt(Pa)) - L^2;

L = fzero(funkcija, 70000)

% denimo da je cena y zrasla -> mi imamo samo se x kovance
% koliko kovancev x imamo?
y = 0;
x = Xr;


funkcija1 = @(x) (x + L./sqrt(Pb)) .* (y + L.*sqrt(Pa)) - L.^2;

st_x = fzero(funkcija1, 50) 
% pravilen odgovor : having a bit over 2 ETH and 0 USDC

% najin izračun: 2.056614470663034


% kaj pa če cena kovanca y padla -> mi imamo samo se kovance y
% koliko kovancev y imamo?
x = 0;
y = Yr;

funkcija1 = @(y) (x + L./sqrt(Pb)) .* (y + L.*sqrt(Pa)) - L.^2;

st_y = fzero(funkcija1, 50) 

% pravilen odgovor: If the ETH price increases to $2200, 
% you are fully in USDC and have apx. $4100 USDC in the LP position

% najin izračun: 4.092611122562796e+03
